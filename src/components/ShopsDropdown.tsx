
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
        // Get shops in a single query using inner join
        const { data: shopData, error } = await supabase
          .from('User-Shop links')
          .select(`
            shop_id,
            Shops:shop_id (
              id,
              name,
              profile_picture
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (shopData) {
          // Transform the data to match our Shop interface
          const formattedShops = shopData
            .map(item => item.Shops)
            .filter((shop): shop is Shop => shop !== null);

          setShops(formattedShops);
          
          // If no shop is selected yet and we have shops, select the first one
          if (!selectedShop && formattedShops.length > 0) {
            setSelectedShop(formattedShops[0]);
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
  }, []); // Dependencies array should be empty to prevent unnecessary fetches

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
};
