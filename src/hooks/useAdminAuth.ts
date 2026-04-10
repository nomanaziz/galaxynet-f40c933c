import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

type AppRole = "super_admin" | "admin" | "staff" | "supervisor";

interface AdminAuth {
  user: User | null;
  role: AppRole | null;
  permissions: string[];
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  signOut: () => Promise<void>;
}

export function useAdminAuth(): AdminAuth {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = role === "super_admin" || role === "admin";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          setTimeout(async () => {
            // Fetch role
            const { data: roleData } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", currentUser.id)
              .maybeSingle();
            const userRole = (roleData?.role as AppRole) ?? null;
            setRole(userRole);

            // Fetch permissions for non-admin roles
            if (userRole && !["super_admin", "admin"].includes(userRole)) {
              const { data: permData } = await supabase
                .from("staff_permissions")
                .select("permission")
                .eq("user_id", currentUser.id);
              setPermissions(permData?.map(p => p.permission) ?? []);
            } else {
              setPermissions([]);
            }

            setLoading(false);
          }, 0);
        } else {
          setRole(null);
          setPermissions([]);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (isAdmin) return true;
    return permissions.includes(permission);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setPermissions([]);
  };

  return {
    user,
    role,
    permissions,
    loading,
    isAdmin,
    isSuperAdmin: role === "super_admin",
    hasPermission,
    signOut,
  };
}
