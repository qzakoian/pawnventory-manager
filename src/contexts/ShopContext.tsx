
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

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
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchShops = async () => {
    if (!user) {
      return [];
    }

    const { data: userShops, error: shopError } = await supabase
      .from('User-Shop links')
      .select(`
        shop_id,
        Shops:shop_id (
          id,
          name,
          profile_picture
        )
      `)
      .eq('user_id', user.id);

    if (shopError) {
      throw shopError;
    }

    if (!userShops) {
      return [];
    }

    return userShops
      .map(link => link.Shops)
      .filter((shop): shop is Shop => shop !== null);
  };

  const {
    data: shops = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['shops', user?.id],
    queryFn: fetchShops,
    enabled: !!user,
    staleTime: Infinity, // Prevent unnecessary refetches
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load shops. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  // Move the initial shop selection to useEffect
  useEffect(() => {
    if (!selectedShop && shops.length > 0 && !isLoading) {
      setSelectedShop(shops[0]);
    }
  }, [shops, isLoading, selectedShop]);

  const value = {
    selectedShop,
    setSelectedShop,
    isLoading,
    error: error ? 'Failed to load shops' : null,
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
