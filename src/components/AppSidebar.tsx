
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Home, BarChart, MessageSquare, Users, Package, Settings, PanelLeftClose, PanelLeft } from "lucide-react";
import { ShopsDropdown } from "./ShopsDropdown";

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();

  const menuItems = [
    {
      title: "Home",
      icon: Home,
      url: "/",
    },
    {
      title: "Analytics",
      icon: BarChart,
      url: "/data",
    },
    {
      title: "Customers",
      icon: Users,
      url: "/customers",
    },
    {
      title: "Products",
      icon: Package,
      url: "/products",
    },
  ];

  const bottomMenuItems = [
    {
      title: "Settings",
      icon: Settings,
      url: "/account-settings",
    },
  ];

  const isActiveLink = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <div className="mb-4">
          <div className="flex items-center px-4 py-4">
            <span className="text-xl font-semibold">Pawn Systems</span>
          </div>
          <div className="px-3">
            <ShopsDropdown />
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={state === "collapsed" ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 hover:bg-gray-100",
                      isActiveLink(item.url) && "bg-gray-100 font-medium"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">{item.title}</span>
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
                  <SidebarTrigger className="flex items-center gap-3 text-gray-700">
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
              {bottomMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={state === "collapsed" ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 hover:bg-gray-100",
                      isActiveLink(item.url) && "bg-gray-100 font-medium"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">{item.title}</span>
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
