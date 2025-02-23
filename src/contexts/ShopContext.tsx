
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
  shops: Shop[];
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchShops = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get shops data through the User-Shop links
        const { data: linkData, error: linkError } = await supabase
          .from('User-Shop links')
          .select('shop_id')
          .eq('user_id', user.id);

        if (linkError) throw linkError;

        if (linkData && linkData.length > 0) {
          const { data: shopData, error: shopError } = await supabase
            .from('Shops')
            .select('id, name, profile_picture')
            .in('id', linkData.map(link => link.shop_id));

          if (shopError) throw shopError;

          if (shopData) {
            setShops(shopData);
            // Only set selected shop if none is selected and we have shops
            if (!selectedShop && shopData.length > 0) {
              setSelectedShop(shopData[0]);
            }
          }
        } else {
          setShops([]);
        }
      } catch (error) {
        console.error('Error fetching shops:', error);
        setError('Failed to load shops');
        toast({
          title: "Error",
          description: "Failed to load shops. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, [user, toast]); // Removed selectedShop dependency

  return (
    <ShopContext.Provider value={{ selectedShop, setSelectedShop, isLoading, error, shops }}>
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
