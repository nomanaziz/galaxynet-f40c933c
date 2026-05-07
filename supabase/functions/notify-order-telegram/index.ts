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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    const CHAT_IDS_RAW = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID");
    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY || !CHAT_IDS_RAW) {
      console.error("Missing env: LOVABLE_API_KEY/TELEGRAM_API_KEY/TELEGRAM_ADMIN_CHAT_ID");
      return new Response(JSON.stringify({ ok: false, error: "not_configured" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { name, phone, address, area, packageLabel, category, dedicatedMbps, notes } = body ?? {};

    if (!name || !phone) {
      return new Response(JSON.stringify({ ok: false, error: "invalid_body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
    ].filter(Boolean);
    const text = lines.join("\n");

    const chatIds = CHAT_IDS_RAW.split(",").map((s) => s.trim()).filter(Boolean);
    const results: any[] = [];
    for (const chat_id of chatIds) {
      const resp = await fetch(`${GATEWAY_URL}/sendMessage`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TELEGRAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat_id, text, parse_mode: "HTML", disable_web_page_preview: true }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) console.error(`Telegram send failed [${resp.status}]`, data);
      results.push({ chat_id, status: resp.status });
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-order-telegram error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
