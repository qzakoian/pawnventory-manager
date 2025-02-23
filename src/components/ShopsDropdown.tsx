
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const ShopsDropdown = () => {
  const { selectedShop, setSelectedShop, shops, isLoading } = useShop();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled>
        <span className={cn("text-gray-500", isCollapsed && "w-full text-center")}>
          {isCollapsed ? "..." : "Loading shops..."}
        </span>
        {!isCollapsed && <ChevronDown className="h-4 w-4 text-gray-400" />}
      </Button>
    );
  }

  const displayText = isCollapsed 
    ? (selectedShop?.name?.[0]?.toUpperCase() || "S") 
    : (selectedShop?.name || "Select Shop");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "w-full border-gray-200 hover:bg-gray-100 hover:text-gray-900",
            isCollapsed ? "px-2 justify-center" : "justify-between"
          )}
        >
          <span className="text-gray-700">{displayText}</span>
          {!isCollapsed && <ChevronDown className="h-4 w-4 text-gray-500" />}
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
