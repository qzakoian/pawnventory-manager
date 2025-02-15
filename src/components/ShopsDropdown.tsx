
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Store, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface Shop {
  id: number;
  name: string | null;
}

export const ShopsDropdown = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserShops = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        setUserEmail(user.email);

        // First get the user's ID and profile picture from the Users table
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('id, profil_picture, first_name, last_name')
          .eq('email', user.email)
          .single();

        if (userError) throw userError;

        setProfilePicture(userData.profil_picture);
        setUserName(`${userData.first_name} ${userData.last_name}`);

        // Then use that ID to get the linked shops
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
        if (userShops.length > 0 && !selectedShop) {
          setSelectedShop(userShops[0]);
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
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/account-settings")}>
          Account and settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Store className="h-4 w-4 mr-2" />
            <span>{selectedShop?.name || "Select Shop"}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-[200px]">
            {shops.map((shop) => (
              <DropdownMenuItem
                key={shop.id}
                className="cursor-pointer"
                onClick={() => setSelectedShop(shop)}
              >
                <Store className="h-4 w-4 mr-2" />
                {shop.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
