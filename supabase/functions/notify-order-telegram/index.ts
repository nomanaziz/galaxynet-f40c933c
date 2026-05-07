import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

function escape(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendTelegram(chat_id: string, text: string, lovableKey: string, telegramKey: string) {
  const resp = await fetch(`${GATEWAY_URL}/sendMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": telegramKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat_id, text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  const data = await resp.json().catch(() => ({}));
  return { status: resp.status, ok: resp.ok, error: resp.ok ? undefined : (data?.description || data?.message || JSON.stringify(data)) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) {
      return new Response(JSON.stringify({ ok: false, error: "telegram_not_configured" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Test mode
    if (body?.test === true && body?.chatId) {
      const text = `🧪 <b>Test message</b>\nLabel: ${escape(body.label || "(unnamed)")}\nGalaxy Net Telegram সঠিকভাবে কনফিগার হয়েছে।\n🕒 ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })} (BD)`;
      const r = await sendTelegram(String(body.chatId), text, LOVABLE_API_KEY, TELEGRAM_API_KEY);
      return new Response(JSON.stringify({ ok: r.ok, results: [{ chat_id: body.chatId, ...r }] }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load settings
    const { data: settings } = await supabase
      .from("site_settings")
      .select("key,value")
      .in("key", ["telegram_enabled", "telegram_chat_ids"]);
    const map: Record<string, string> = {};
    (settings ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });

    const enabled = map.telegram_enabled !== "false"; // default on if not set
    if (!enabled) {
      return new Response(JSON.stringify({ ok: true, skipped: "disabled" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let chatIds: string[] = [];
    try {
      const arr = JSON.parse(map.telegram_chat_ids || "[]");
      if (Array.isArray(arr)) chatIds = arr.map((r: any) => String(r.chat_id)).filter(Boolean);
    } catch { /* ignore */ }

    if (chatIds.length === 0) {
      const fallback = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID") || "";
      chatIds = fallback.split(",").map(s => s.trim()).filter(Boolean);
    }

    if (chatIds.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: "no_recipients" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, phone, address, area, packageLabel, category, dedicatedMbps, notes } = body ?? {};
    if (!name || !phone) {
      return new Response(JSON.stringify({ ok: false, error: "invalid_body" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lines = [
      "🆕 <b>New Connection Order</b>",
      `👤 <b>Name:</b> ${escape(name)}`,
      `📞 <b>Phone:</b> ${escape(phone)}`,
      area ? `📍 <b>Area:</b> ${escape(area)}` : null,
      address ? `🏠 <b>Address:</b> ${escape(address)}` : null,
      category ? `🏷️ <b>Category:</b> ${escape(category)}` : null,
      packageLabel ? `📦 <b>Package:</b> ${escape(packageLabel)}` : null,
      dedicatedMbps ? `⚡ <b>Dedicated:</b> ${escape(dedicatedMbps)} Mbps` : null,
      notes ? `📝 <b>Notes:</b> ${escape(notes)}` : null,
      `🕒 ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })} (BD)`,
    ].filter(Boolean).join("\n");

    const results = [];
    for (const chat_id of chatIds) {
      const r = await sendTelegram(chat_id, lines, LOVABLE_API_KEY, TELEGRAM_API_KEY);
      if (!r.ok) console.error(`Telegram send failed [${r.status}] chat ${chat_id}:`, r.error);
      results.push({ chat_id, ...r });
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-order-telegram error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
