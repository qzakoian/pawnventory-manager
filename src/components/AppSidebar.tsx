
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Home, Users, Package, Settings, HelpCircle, PanelLeftClose, PanelLeft } from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();

  const topMenuItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "/",
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
    {
      title: "Help",
      icon: HelpCircle,
      url: "/help",
    },
  ];

  const isActiveLink = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 py-2">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarTrigger>
              {state === "expanded" ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </SidebarTrigger>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {topMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={state === "collapsed" ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-2",
                      isActiveLink(item.url) && "bg-[#646ECB]/10 text-[#646ECB]"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
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
              {bottomMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={state === "collapsed" ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-2",
                      isActiveLink(item.url) && "bg-[#646ECB]/10 text-[#646ECB]"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
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
