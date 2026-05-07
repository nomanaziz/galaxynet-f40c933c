import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify calling user is admin
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

    const { data: { user: callerUser }, error: userError } = await anonClient.auth.getUser();
    if (userError || !callerUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const callerUid = callerUser.id;

    // Check caller is admin using service role
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: callerRole } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUid)
      .maybeSingle();

    if (!callerRole || !["super_admin", "admin"].includes(callerRole.role)) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse and validate input
    const { email, password, name, role, permissions } = await req.json();

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: "email, password, and role are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validRoles = ["admin", "staff", "supervisor"];
    if (!validRoles.includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create the user (or reuse existing)
    let userId: string | null = null;
    let reused = false;

    const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name || email },
    });

    if (createError) {
      const msg = (createError.message || "").toLowerCase();
      const alreadyExists = msg.includes("already been registered") || msg.includes("already registered") || msg.includes("already exists");
      if (!alreadyExists) {
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Find existing user by paginating through admin.listUsers
      let page = 1;
      while (page <= 20 && !userId) {
        const { data: list, error: listErr } = await serviceClient.auth.admin.listUsers({ page, perPage: 200 });
        if (listErr) break;
        const found = list.users.find((u: any) => (u.email || "").toLowerCase() === email.toLowerCase());
        if (found) { userId = found.id; break; }
        if (list.users.length < 200) break;
        page++;
      }

      if (!userId) {
        return new Response(JSON.stringify({ error: "User exists but could not be located. Please try again." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      reused = true;
    } else {
      userId = newUser.user.id;
    }

    // Upsert role (delete any existing role first to avoid duplicates, then insert new role)
    await serviceClient.from("user_roles").delete().eq("user_id", userId);
    const { error: roleErr } = await serviceClient.from("user_roles").insert({
      user_id: userId,
      role,
    });
    if (roleErr) {
      return new Response(JSON.stringify({ error: `Failed to assign role: ${roleErr.message}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Replace permissions
    await serviceClient.from("staff_permissions").delete().eq("user_id", userId);
    if (permissions && Array.isArray(permissions) && permissions.length > 0) {
      const permRows = permissions.map((p: string) => ({
        user_id: userId,
        permission: p,
      }));
      const { error: permErr } = await serviceClient.from("staff_permissions").insert(permRows);
      if (permErr) {
        return new Response(JSON.stringify({ error: `Failed to assign permissions: ${permErr.message}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ user_id: userId, email, reused }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
