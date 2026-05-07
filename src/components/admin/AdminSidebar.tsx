import {
  LayoutDashboard, Package, MapPin, ShoppingCart, FileText,
  Bell, Settings, Users, LogOut, Menu, CreditCard, Home, Image, ExternalLink,
  Gift, Star, Handshake, Sparkles, Building2, BadgeCheck, UserCog, Globe, Info, Server, Send
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import logo from "@/assets/logo.png";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true, permission: null },
  { title: "Packages", url: "/admin/packages", icon: Package, permission: "packages" },
  { title: "Coverage", url: "/admin/coverage", icon: MapPin, permission: "coverage" },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart, permission: "orders" },
  { title: "Pages", url: "/admin/pages", icon: FileText, permission: "pages" },
  { title: "Notices", url: "/admin/notices", icon: Bell, permission: "notices" },
  { title: "Offers", url: "/admin/offers", icon: Gift, permission: "offers" },
  { title: "Testimonials", url: "/admin/testimonials", icon: Star, permission: "testimonials" },
  { title: "Partners", url: "/admin/partners", icon: Handshake, permission: "partners" },
  { title: "Features", url: "/admin/features", icon: Sparkles, permission: "features" },
  { title: "Menu", url: "/admin/menu", icon: Menu, permission: "menu" },
  { title: "Payments", url: "/admin/payments", icon: CreditCard, permission: "payments" },
  { title: "Homepage", url: "/admin/homepage", icon: Home, permission: "homepage" },
  { title: "Media", url: "/admin/media", icon: Image, permission: "media" },
  { title: "Services", url: "/admin/services", icon: Globe, permission: "services" },
  { title: "Festivals", url: "/admin/festivals", icon: Sparkles, permission: "festivals" },
  { title: "About Page", url: "/admin/about", icon: Info, permission: "about" },
  { title: "FTP/OTT Servers", url: "/admin/ftp-servers", icon: Server, permission: "ftp_servers" },
];

const aboutItems = [
  { title: "Departments", url: "/admin/departments", icon: Building2, permission: "departments" },
  { title: "Designations", url: "/admin/designations", icon: BadgeCheck, permission: "designations" },
  { title: "Employees", url: "/admin/employees", icon: UserCog, permission: "employees" },
];

const systemItems = [
  { title: "Telegram", url: "/admin/telegram", icon: Send, permission: null },
  { title: "Settings", url: "/admin/settings", icon: Settings, permission: null },
  { title: "Users", url: "/admin/users", icon: Users, permission: null },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { isSuperAdmin, isAdmin, hasPermission, signOut, user } = useAdminAuth();

  const filterItems = (items: typeof mainItems) =>
    items.filter(item => !item.permission || hasPermission(item.permission));

  const visibleMain = filterItems(mainItems);
  const visibleAbout = filterItems(aboutItems);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Galaxy Net" className="h-8 w-auto brightness-0 invert shrink-0" />
          {!collapsed && (
            <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
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
              {visibleMain.map((item) => (
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

        {visibleAbout.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>About Us / Team</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleAbout.map((item) => (
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
