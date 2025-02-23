
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

  const fetchShops = async () => {
    if (!user) {
      setShops([]);
      setSelectedShop(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First, get all shops the user has access to
      const { data: shops, error: shopError } = await supabase
        .from('Shops')
        .select('id, name, profile_picture');

      if (shopError) {
        console.error('Error fetching shops:', shopError);
        throw shopError;
      }

      if (shops) {
        console.log('Fetched shops:', shops);
        setShops(shops);
        
        // If no shop is selected and we have shops, select the first one
        if (!selectedShop && shops.length > 0) {
          console.log('Setting initial shop:', shops[0]);
          setSelectedShop(shops[0]);
        }
      }
    } catch (error) {
      console.error('Error in fetchShops:', error);
      setError('Failed to load shops');
      toast({
        title: "Error",
        description: "Failed to load shops. Please try again later.",
        variant: "destructive",
      });
      setShops([]);
      setSelectedShop(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch shops when user changes
  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching shops...');
      fetchShops();
    } else {
      console.log('No user, clearing shops...');
      setShops([]);
      setSelectedShop(null);
      setIsLoading(false);
    }
  }, [user]);

  const value = {
    selectedShop,
    setSelectedShop,
    isLoading,
    error,
    shops
  };

  return (
    <ShopContext.Provider value={value}>
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
