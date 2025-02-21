
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Shop {
  id: number;
  name: string | null;
  profile_picture: string | null;
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

        if (shopLinks && shopLinks.length > 0 && shopLinks[0].Shops) {
          const shop = shopLinks[0].Shops;
          if (
            typeof shop === 'object' &&
            shop !== null &&
            'id' in shop
          ) {
            setSelectedShop(shop as Shop);
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
