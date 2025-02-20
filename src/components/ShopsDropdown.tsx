
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Store, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useShop } from "@/contexts/ShopContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

        const { data: userData } = await supabase
          .from('Users')
          .select('id')
          .eq('email', user.email)
          .single();

        if (!userData) return;

        const { data: shopLinks, error: shopError } = await supabase
          .from('User-Shop links')
          .select(`
            shop_id,
            Shops (
              id,
              name,
              profile_picture
            )
          `)
          .eq('user_id', userData.id);

        if (shopError) throw shopError;

        const userShops = shopLinks
          .map(link => link.Shops)
          .filter((shop): shop is Shop => shop !== null);

        setShops(userShops);
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
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={selectedShop?.profile_picture || undefined} alt={selectedShop?.name || "Shop"} />
              <AvatarFallback>
                <Store className="h-4 w-4 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-700">{selectedShop?.name || "Select Shop"}</span>
          </div>
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
            <Avatar className="h-4 w-4 mr-2">
              <AvatarImage src={shop.profile_picture || undefined} alt={shop.name || "Shop"} />
              <AvatarFallback>
                <Store className="h-3 w-3 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <span>{shop.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
