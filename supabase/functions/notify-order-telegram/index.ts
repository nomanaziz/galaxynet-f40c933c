import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escape(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendTelegram(token: string, chat_id: string, text: string) {
  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  const data = await resp.json().catch(() => ({}));
  return {
    status: resp.status,
    ok: resp.ok && data?.ok !== false,
    error: resp.ok && data?.ok !== false ? undefined : (data?.description || `HTTP ${resp.status}`),
  };
}

function supergroupFallbackId(chatId: string): string | null {
  const normalized = chatId.trim();
  if (!normalized.startsWith("-") || normalized.startsWith("-100")) return null;
  const digits = normalized.slice(1);
  return /^\d{10,}$/.test(digits) ? `-100${digits}` : null;
}

async function sendTelegramWithFallback(token: string, chat_id: string, text: string) {
  const first = await sendTelegram(token, chat_id, text);
  const fallbackId = supergroupFallbackId(chat_id);
  if (first.ok || !fallbackId || !String(first.error || "").toLowerCase().includes("chat not found")) {
    return { chat_id, ...first };
  }

  const retry = await sendTelegram(token, fallbackId, text);
  return {
    chat_id,
    attempted_chat_id: fallbackId,
    ...retry,
    error: retry.ok ? undefined : `${retry.error} (also tried ${fallbackId})`,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = await req.json().catch(() => ({}));

    const { data: settings } = await supabase
      .from("site_settings")
      .select("key,value")
      .in("key", ["telegram_enabled", "telegram_chat_ids", "telegram_bot_token"]);
    const map: Record<string, string> = {};
    (settings ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });

    const token = (map.telegram_bot_token || "").trim();
    if (!token) {
      return new Response(JSON.stringify({ ok: false, error: "bot_token_not_configured", results: [{ status: 0, ok: false, error: "Bot Token দেওয়া হয়নি" }] }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Test mode
    if (body?.test === true && body?.chatId) {
      const text = `🧪 <b>Test message</b>\nLabel: ${escape(body.label || "(unnamed)")}\nGalaxy Net Telegram সঠিকভাবে কনফিগার হয়েছে।\n🕒 ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })} (BD)`;
      const r = await sendTelegramWithFallback(token, String(body.chatId), text);
      return new Response(JSON.stringify({ ok: r.ok, results: [r] }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const enabled = map.telegram_enabled !== "false";
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

    const text = [
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
      const r = await sendTelegramWithFallback(token, chat_id, text);
      if (!r.ok) console.error(`Telegram send failed for ${chat_id}:`, r.error);
      results.push(r);
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
