
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Store, User, LogOut, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useShop } from "@/contexts/ShopContext";

interface Shop {
  id: number;
  name: string | null;
}

export const ShopsDropdown = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { selectedShop, setSelectedShop } = useShop();

  useEffect(() => {
    const fetchUserShops = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        setUserEmail(user.email);

        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('id, profil_picture, first_name, last_name')
          .eq('email', user.email)
          .single();

        if (userError) throw userError;

        setProfilePicture(userData.profil_picture);
        setUserName(`${userData.first_name} ${userData.last_name}`);

        const { data: shopLinks, error: shopError } = await supabase
          .from('User-Shop links')
          .select(`
            shop_id,
            Shops (
              id,
              name
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 text-white hover:text-white hover:bg-white/20">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={profilePicture || undefined} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          {selectedShop?.name || "Select Shop"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px] bg-white">
        <div className="flex items-start space-x-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profilePicture || undefined} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs text-muted-foreground mt-1">{userEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-[#646ECB] hover:text-white"
          onClick={() => navigate("/account-settings")}
        >
          <Settings className="h-4 w-4 mr-2" />
          Account and settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Store className="h-4 w-4 mr-2" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Shop</span>
                <span>{selectedShop?.name || "Select Shop"}</span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-[200px]">
              <DropdownMenuItem
                className="cursor-pointer hover:bg-[#646ECB] hover:text-white"
                onClick={() => navigate("/account-settings?tab=shops")}
              >
                All my shops
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {shops.map((shop) => (
                <DropdownMenuItem
                  key={shop.id}
                  className="cursor-pointer hover:bg-[#646ECB] hover:text-white"
                  onClick={() => setSelectedShop(shop)}
                >
                  <Store className="h-4 w-4 mr-2" />
                  {shop.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 cursor-pointer hover:bg-red-50" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
