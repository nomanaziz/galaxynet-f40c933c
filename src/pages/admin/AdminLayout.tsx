import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ROUTE_PERMISSION_MAP } from "@/lib/adminPermissions";
import { Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLayout = () => {
  const { user, loading, role, hasPermission, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || !role)) {
      navigate("/admin/login", { replace: true });
    }
  }, [loading, user, role, navigate]);

  // Route-level permission check
  useEffect(() => {
    if (loading || !user || !role || isAdmin) return;

    const segments = location.pathname.replace("/admin/", "").replace("/admin", "").split("/");
    const segment = segments[0];
    const requiredPerm = ROUTE_PERMISSION_MAP[segment];

    if (requiredPerm && !hasPermission(requiredPerm)) {
      toast({ title: "অ্যাক্সেস নেই", description: "আপনার এই সেকশনে প্রবেশের অনুমতি নেই", variant: "destructive" });
      navigate("/admin", { replace: true });
    }
  }, [loading, user, role, isAdmin, location.pathname, hasPermission, navigate, toast]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !role) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-background px-4">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-semibold text-foreground">Galaxy Net Admin</h1>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink className="h-4 w-4" />
              Visit Site
            </a>
          </header>
          <main className="flex-1 overflow-auto bg-muted/30 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
