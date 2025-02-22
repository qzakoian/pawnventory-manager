
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface Shop {
  id: number;
  name: string | null;
  profile_picture: string | null;
}

interface ShopContextType {
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
  isLoading: boolean;
  error: string | null;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDefaultShop = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Now we can use a simpler join query since RLS is disabled
        const { data: userShops, error: queryError } = await supabase
          .from('User-Shop links')
          .select(`
            Shops:shop_id (
              id,
              name,
              profile_picture
            )
          `)
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (queryError) {
          throw queryError;
        }

        if (userShops?.Shops) {
          setSelectedShop(userShops.Shops);
        } else {
          toast({
            title: "No shop found",
            description: "Please create or join a shop to continue.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching shop:', error);
        setError('Failed to load shop data');
        toast({
          title: "Error",
          description: "Failed to load shop data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefaultShop();
  }, [user, toast]);

  return (
    <ShopContext.Provider value={{ selectedShop, setSelectedShop, isLoading, error }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
