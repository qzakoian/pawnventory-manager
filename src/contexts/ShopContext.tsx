
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

        // First, get the shop IDs for this user
        const { data: linkData, error: linkError } = await supabase
          .from('User-Shop links')
          .select('shop_id')
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (linkError) {
          console.error('Error fetching shop links:', linkError);
          return;
        }

        if (linkData) {
          // Then, get the shop details
          const { data: shopData, error: shopError } = await supabase
            .from('Shops')
            .select('id, name, profile_picture')
            .eq('id', linkData.shop_id)
            .single();

          if (shopError) {
            console.error('Error fetching shop:', shopError);
            return;
          }

          if (shopData) {
            setSelectedShop(shopData);
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
