
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useShop } from "@/contexts/ShopContext";

interface Shop {
  id: number;
  name: string | null;
  profile_picture: string | null;
}

export const ShopsDropdown = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const { toast } = useToast();
  const { selectedShop, setSelectedShop } = useShop();

  useEffect(() => {
    const fetchUserShops = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // First, get all shop IDs for this user
        const { data: linkData, error: linkError } = await supabase
          .from('User-Shop links')
          .select('shop_id')
          .eq('user_id', user.id);

        if (linkError) throw linkError;

        if (linkData && linkData.length > 0) {
          // Then, get all shop details
          const shopIds = linkData.map(link => link.shop_id);
          const { data: shopData, error: shopError } = await supabase
            .from('Shops')
            .select('id, name, profile_picture')
            .in('id', shopIds);

          if (shopError) throw shopError;

          if (shopData) {
            setShops(shopData);
          }
        }
      } catch (error) {
        console.error('Error fetching shops:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load shops",
        });
      }
    };

    fetchUserShops();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between border-gray-200 hover:bg-gray-100 hover:text-gray-900"
        >
          <span className="text-gray-700">{selectedShop?.name || "Select Shop"}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {shops.map((shop) => (
          <DropdownMenuItem
            key={shop.id}
            onClick={() => setSelectedShop(shop)}
            className="cursor-pointer"
          >
            <span>{shop.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
