import {
  LayoutDashboard, Package, MapPin, ShoppingCart, FileText,
  Bell, Settings, Users, LogOut, Wifi, Menu, CreditCard, Home, Image, ExternalLink,
  Gift, Star, Handshake, Sparkles, Building2, BadgeCheck, UserCog
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Packages", url: "/admin/packages", icon: Package },
  { title: "Coverage", url: "/admin/coverage", icon: MapPin },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Pages", url: "/admin/pages", icon: FileText },
  { title: "Notices", url: "/admin/notices", icon: Bell },
  { title: "Offers", url: "/admin/offers", icon: Gift },
  { title: "Testimonials", url: "/admin/testimonials", icon: Star },
  { title: "Partners", url: "/admin/partners", icon: Handshake },
  { title: "Features", url: "/admin/features", icon: Sparkles },
  { title: "Menu", url: "/admin/menu", icon: Menu },
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
  { title: "Homepage", url: "/admin/homepage", icon: Home },
  { title: "Media", url: "/admin/media", icon: Image },
];

const aboutItems = [
  { title: "Departments", url: "/admin/departments", icon: Building2 },
  { title: "Designations", url: "/admin/designations", icon: BadgeCheck },
  { title: "Employees", url: "/admin/employees", icon: UserCog },
];

const systemItems = [
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "Users", url: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { isSuperAdmin, signOut, user } = useAdminAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary">
            <Wifi className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-sidebar-foreground">Galaxy Net</p>
              <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
            </div>
          )}
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1.5 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
          <ExternalLink className="h-3 w-3" />
          {!collapsed && <span>Visit Site</span>}
        </a>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.end} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isSuperAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {systemItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && user && (
          <p className="mb-2 truncate text-xs text-sidebar-foreground/70">{user.email}</p>
        )}
        <Button variant="ghost" size={collapsed ? "icon" : "default"} className="w-full text-sidebar-foreground hover:bg-sidebar-accent/50" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
