import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user: callerUser } } = await anonClient.auth.getUser();
    if (!callerUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: callerRole } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .in("role", ["super_admin", "admin"])
      .limit(1)
      .maybeSingle();
    if (!callerRole || !["super_admin", "admin"].includes(callerRole.role)) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all roles
    const { data: roles, error: rolesError } = await serviceClient
      .from("user_roles")
      .select("id, user_id, role");

    if (rolesError) {
      return new Response(JSON.stringify({ error: `Failed to load staff roles: ${rolesError.message}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all auth users (paginated)
    const emailMap: Record<string, string> = {};
    const nameMap: Record<string, string> = {};
    let page = 1;
    while (true) {
      const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage: 200 });
      if (error) break;
      data.users.forEach((u: any) => {
        emailMap[u.id] = u.email ?? "";
        nameMap[u.id] = u.user_metadata?.full_name ?? "";
      });
      if (!data.users.length || data.users.length < 200) break;
      page++;
    }

    // Permission counts
    const { data: perms } = await serviceClient
      .from("staff_permissions").select("user_id, permission");
    const permCount: Record<string, number> = {};
    (perms ?? []).forEach((p: any) => {
      permCount[p.user_id] = (permCount[p.user_id] || 0) + 1;
    });

    const result = (roles ?? []).map((r: any) => ({
      id: r.id,
      user_id: r.user_id,
      role: r.role,
      email: emailMap[r.user_id] ?? "",
      name: nameMap[r.user_id] ?? "",
      permissionCount: permCount[r.user_id] || 0,
    }));

    return new Response(JSON.stringify({ users: result }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
