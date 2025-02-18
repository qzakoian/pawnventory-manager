
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Shop {
  id: number;
  name: string | null;
}

interface ShopContextType {
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  useEffect(() => {
    const fetchDefaultShop = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('No user found');
          return;
        }

        const { data: shopLinks, error: shopLinksError } = await supabase
          .from('User-Shop links')
          .select(`
            shop_id,
            Shops (
              id,
              name
            )
          `)
          .eq('user_id', user.id)
          .limit(1);

        if (shopLinksError) {
          console.error('Error fetching shop links:', shopLinksError);
          return;
        }

        if (shopLinks && shopLinks.length > 0 && shopLinks[0].Shops) {
          setSelectedShop(shopLinks[0].Shops);
        }
      } catch (error) {
        console.error('Error fetching default shop:', error);
      }
    };

    if (!selectedShop) {
      fetchDefaultShop();
    }
  }, [selectedShop]);

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
