
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Home, BarChart, MessageSquare, Users, Package, Settings, Store, ArrowLeft } from "lucide-react";
import { ShopsDropdown } from "./ShopsDropdown";
import { useShop } from "@/contexts/ShopContext";

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
        <div className="relative">
          {/* Collapse button moved to top right */}
          <div className="absolute right-2 top-2 z-10">
            <SidebarTrigger className="flex items-center gap-2 px-2 py-1 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-4 w-4" />
              {state === "expanded" && <span>Reduce the sidebar</span>}
            </SidebarTrigger>
          </div>
          
          <div className="mb-4">
            <div className="flex flex-col">
              <div className="p-2">
                <div className={cn(
                  "relative overflow-hidden transition-all duration-200 w-full",
                  state === "expanded" ? "h-48" : "h-32"
                )}>
                  {selectedShop?.profile_picture ? (
                    <img 
                      src={selectedShop.profile_picture} 
                      alt={selectedShop.name || "Shop"}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Store className={cn(
                        "text-gray-500",
                        state === "expanded" ? "h-24 w-24" : "h-16 w-16"
                      )} />
                    </div>
                  )}
                </div>
              </div>
              <div className="px-3">
                <ShopsDropdown />
              </div>
            </div>
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
