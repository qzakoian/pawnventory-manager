
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Shop {
  id: number;
  name: string | null;
  profile_picture: string | null;
}

interface ShopLink {
  shop_id: number;
  Shops: Shop;
}

interface ShopContextType {
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDefaultShop = async () => {
      try {
        if (!user) {
          console.log('No authenticated user');
          return;
        }

        const { data: shopLinks, error: shopLinksError } = await supabase
          .from('User-Shop links')
          .select(`
            shop_id,
            Shops (
              id,
              name,
              profile_picture
            )
          `)
          .eq('user_id', user.id)
          .limit(1);

        if (shopLinksError) {
          console.error('Error fetching shop links:', shopLinksError);
          return;
        }

        if (shopLinks && shopLinks.length > 0) {
          const shopLink = shopLinks[0] as ShopLink;
          if (shopLink.Shops) {
            setSelectedShop(shopLink.Shops);
          }
        }
      } catch (error) {
        console.error('Error fetching default shop:', error);
      }
    };

    if (!selectedShop) {
      fetchDefaultShop();
    }
  }, [selectedShop, user]);

  return (
    <ShopContext.Provider value={{ selectedShop, setSelectedShop }}>
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
