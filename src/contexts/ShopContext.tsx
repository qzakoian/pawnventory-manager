
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

  useEffect(() => {
    const fetchDefaultShop = async () => {
      try {
        if (!user) {
          console.log('No authenticated user');
          return;
        }

        // First get the Users record to get the numeric ID
        const { data: userData } = await supabase
          .from('Users')
          .select('id')
          .eq('email', user.email)
          .single();

        if (!userData) {
          console.log('No user record found');
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
          .eq('user_id', userData.id)
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
