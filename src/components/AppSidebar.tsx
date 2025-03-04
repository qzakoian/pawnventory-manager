
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Home, BarChart, Users, Package, Settings, Store, ArrowLeftToLine, Menu } from "lucide-react";
import { ShopsDropdown } from "./ShopsDropdown";
import { useShop } from "@/contexts/ShopContext";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar() {
  const location = useLocation();
  const {
    state,
    openMobile,
    setOpenMobile,
    isMobile
  } = useSidebar();
  const {
    selectedShop
  } = useShop();
  
  const menuItems = [{
    title: "Home",
    icon: Home,
    url: "/dashboard"
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
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r bg-white text-foreground">
        <SidebarContent>
          {/* Collapse button container */}
          <div className="absolute right-0 top-0 z-50 p-2">
            <SidebarTrigger className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <ArrowLeftToLine className={cn("h-4 w-4 transition-transform", state === "expanded" ? "" : "rotate-180")} />
            </SidebarTrigger>
          </div>

          {/* Main content with proper spacing for the button */}
          <div className="mt-12">
            <div className="flex flex-col">
              <div className="p-2">
                <div className={cn("relative overflow-hidden transition-all duration-200 w-full", state === "expanded" ? "h-48" : "h-32")}>
                  {selectedShop?.profile_picture ? <img src={selectedShop.profile_picture} alt={selectedShop.name || "Shop"} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Store className={cn("text-gray-500", state === "expanded" ? "h-24 w-24" : "h-16 w-16")} />
                    </div>}
                </div>
              </div>
              <div className="px-2">
                <ShopsDropdown />
              </div>
            </div>
          </div>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map(item => <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={state === "collapsed" ? item.title : undefined} className={cn("flex items-center gap-3 px-4 py-2 hover:bg-gray-100", isActiveLink(item.url) && "bg-gray-100 font-medium")}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-600" />
                        <span className="text-[#454545]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-0">
          <SidebarGroup className="p-0">
            <SidebarGroupContent className="px-[8px] py-[16px]">
              <SidebarMenu>
                {bottomMenuItems.map(item => <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={state === "collapsed" ? item.title : undefined} className={cn("flex items-center gap-3 px-4 py-2 hover:bg-gray-100", isActiveLink(item.url) && "bg-gray-100 font-medium")}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-600" />
                        <span className="text-[#454545]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* Mobile sidebar toggle button */}
      {isMobile && !openMobile && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg border border-gray-200 bg-white text-gray-700 h-12 w-12"
          onClick={() => setOpenMobile(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}
