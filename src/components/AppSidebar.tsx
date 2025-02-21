
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Home, BarChart, MessageSquare, Users, Package, Settings, PanelLeftClose, PanelLeft, Store } from "lucide-react";
import { ShopsDropdown } from "./ShopsDropdown";
import { useShop } from "@/contexts/ShopContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { selectedShop } = useShop();

  const menuItems = [{
    title: "Home",
    icon: Home,
    url: "/"
  }, {
    title: "Customers",
    icon: Users,
    url: "/customers"
  }, {
    title: "Products",
    icon: Package,
    url: "/products"
  }, {
    title: "Analytics",
    icon: BarChart,
    url: "/data"
  }];

  const bottomMenuItems = [{
    title: "Settings",
    icon: Settings,
    url: "/account-settings"
  }];

  const isActiveLink = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-white text-foreground">
      <SidebarContent>
        <div className="mb-4">
          <div className="flex items-center justify-center px-4 py-4">
            <Avatar className={cn(
              "transition-all duration-200",
              state === "expanded" ? "h-12 w-12" : "h-8 w-8"
            )}>
              <AvatarImage 
                src={selectedShop?.profile_picture || undefined} 
                alt={selectedShop?.name || "Shop"} 
              />
              <AvatarFallback>
                <Store className={cn(
                  "text-gray-500",
                  state === "expanded" ? "h-6 w-6" : "h-4 w-4"
                )} />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="px-3 py-[16px]">
            <ShopsDropdown />
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={state === "collapsed" ? item.title : undefined} className={cn("flex items-center gap-3 px-4 py-2 hover:bg-gray-100", isActiveLink(item.url) && "bg-gray-100 font-medium")}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-gray-600" />
                      <span className="text-[#454545]">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="px-4 py-2">
                  <SidebarTrigger className="flex items-center gap-3">
                    {state === "expanded" ? (
                      <>
                        <PanelLeftClose className="h-5 w-5 text-gray-500" />
                        <span className="group-data-[collapsible=icon]:hidden">Collapse</span>
                      </>
                    ) : (
                      <>
                        <PanelLeft className="h-5 w-5 text-gray-500" />
                        <span className="group-data-[collapsible=icon]:hidden">Expand</span>
                      </>
                    )}
                  </SidebarTrigger>
                </div>
              </SidebarMenuItem>
              {bottomMenuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={state === "collapsed" ? item.title : undefined} className={cn("flex items-center gap-3 px-4 py-2 hover:bg-gray-100", isActiveLink(item.url) && "bg-gray-100 font-medium")}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-gray-500" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
