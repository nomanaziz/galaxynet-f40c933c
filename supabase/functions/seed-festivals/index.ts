import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const festivals = [
      {
        name: "Victory Day", name_bn: "বিজয় দিবস",
        greeting_en: "Happy Victory Day!", greeting_bn: "বিজয় দিবসের শুভেচ্ছা!",
        start_date: "2025-12-16", end_date: "2025-12-16",
        gradient_from: "#15803d", gradient_to: "#dc2626",
        accent_color: "140 60% 40%",
        decoration_type: "confetti", animation_type: "particles",
        is_ramadan: false, enabled: true,
        banner_text_en: "Celebrating our glorious victory!",
        banner_text_bn: "গৌরবময় বিজয়ের উদযাপন!",
      },
      {
        name: "Christmas", name_bn: "বড়দিন",
        greeting_en: "Merry Christmas!", greeting_bn: "শুভ বড়দিন!",
        start_date: "2025-12-25", end_date: "2025-12-25",
        gradient_from: "#dc2626", gradient_to: "#15803d",
        accent_color: "0 70% 50%",
        decoration_type: "lights", animation_type: "particles",
        is_ramadan: false, enabled: true,
        banner_text_en: "Merry Christmas! Wishing you peace and joy",
        banner_text_bn: "শুভ বড়দিন! শান্তি ও আনন্দের শুভেচ্ছা",
      },
      {
        name: "New Year", name_bn: "নববর্ষ",
        greeting_en: "Happy New Year 2026!", greeting_bn: "শুভ নববর্ষ ২০২৬!",
        start_date: "2026-01-01", end_date: "2026-01-01",
        gradient_from: "#1e1b4b", gradient_to: "#b8860b",
        accent_color: "45 80% 50%",
        decoration_type: "confetti", animation_type: "particles",
        is_ramadan: false, enabled: true,
        banner_text_en: "Happy New Year! Here's to new beginnings",
        banner_text_bn: "শুভ নববর্ষ! নতুন শুরুর শুভেচ্ছা",
      },
      {
        name: "Shab-e-Barat", name_bn: "শবে বরাত",
        greeting_en: "Blessed Shab-e-Barat", greeting_bn: "শবে বরাতের শুভেচ্ছা",
        start_date: "2026-01-15", end_date: "2026-01-16",
        gradient_from: "#312e81", gradient_to: "#7c3aed",
        accent_color: "260 80% 60%",
        decoration_type: "stars", animation_type: "glow",
        is_ramadan: false, enabled: true,
        banner_text_en: "May your prayers be answered on this blessed night",
        banner_text_bn: "এই বরকতময় রাতে আপনার প্রার্থনা কবুল হোক",
      },
      {
        name: "International Mother Language Day", name_bn: "আন্তর্জাতিক মাতৃভাষা দিবস",
        greeting_en: "Remembering our Language Martyrs", greeting_bn: "ভাষা শহীদদের স্মরণে",
        start_date: "2026-02-21", end_date: "2026-02-21",
        gradient_from: "#991b1b", gradient_to: "#7f1d1d",
        accent_color: "0 70% 40%",
        decoration_type: "lights", animation_type: "glow",
        is_ramadan: false, enabled: true,
        banner_text_en: "We remember the supreme sacrifice for our mother tongue",
        banner_text_bn: "মাতৃভাষার জন্য সর্বোচ্চ আত্মত্যাগ স্মরণে",
      },
      {
        name: "Ramadan", name_bn: "রমজান",
        greeting_en: "Ramadan Mubarak!", greeting_bn: "রমজান মুবারক!",
        start_date: "2026-03-01", end_date: "2026-03-30",
        gradient_from: "#0a1628", gradient_to: "#4a1a6b",
        accent_color: "45 100% 50%",
        decoration_type: "stars", animation_type: "glow",
        is_ramadan: true, sehri_time: "04:15 AM", iftar_time: "06:30 PM",
        enabled: true,
        banner_text_en: "Ramadan Kareem - May this holy month bring peace and blessings",
        banner_text_bn: "রমজান করীম - এই পবিত্র মাস শান্তি ও বরকত আনুক",
      },
      {
        name: "Independence Day", name_bn: "স্বাধীনতা দিবস",
        greeting_en: "Happy Independence Day!", greeting_bn: "স্বাধীনতা দিবসের শুভেচ্ছা!",
        start_date: "2026-03-26", end_date: "2026-03-26",
        gradient_from: "#15803d", gradient_to: "#dc2626",
        accent_color: "0 70% 50%",
        decoration_type: "confetti", animation_type: "particles",
        is_ramadan: false, enabled: true,
        banner_text_en: "Celebrating the spirit of freedom and independence",
        banner_text_bn: "স্বাধীনতার চেতনায় উজ্জীবিত",
      },
      {
        name: "Eid ul-Fitr", name_bn: "ঈদ উল ফিতর",
        greeting_en: "Eid Mubarak!", greeting_bn: "ঈদ মুবারক!",
        start_date: "2026-03-31", end_date: "2026-04-02",
        gradient_from: "#b8860b", gradient_to: "#0d5e3a",
        accent_color: "120 60% 30%",
        decoration_type: "lanterns", animation_type: "particles",
        is_ramadan: false, enabled: true,
        banner_text_en: "Eid Mubarak! Wishing you joy and happiness",
        banner_text_bn: "ঈদ মুবারক! আনন্দ ও সুখের শুভেচ্ছা",
      },
      {
        name: "Pohela Boishakh", name_bn: "পহেলা বৈশাখ",
        greeting_en: "Shubho Noboborsho!", greeting_bn: "শুভ নববর্ষ!",
        start_date: "2026-04-14", end_date: "2026-04-15",
        gradient_from: "#dc2626", gradient_to: "#c2410c",
        accent_color: "0 80% 50%",
        decoration_type: "alpana", animation_type: "particles",
        is_ramadan: false, enabled: true,
        banner_text_en: "Happy Bengali New Year 1433!",
        banner_text_bn: "শুভ নববর্ষ ১৪৩৩!",
      },
      {
        name: "Eid ul-Adha", name_bn: "ঈদ উল আযহা",
        greeting_en: "Eid Mubarak!", greeting_bn: "ঈদ মুবারক!",
        start_date: "2026-06-07", end_date: "2026-06-09",
        gradient_from: "#065f46", gradient_to: "#0d9488",
        accent_color: "160 70% 40%",
        decoration_type: "lanterns", animation_type: "particles",
        is_ramadan: false, enabled: true,
        banner_text_en: "Eid ul-Adha Mubarak! May your sacrifices be accepted",
        banner_text_bn: "ঈদ উল আযহা মুবারক! আপনার কোরবানি কবুল হোক",
      },
      {
        name: "Durga Puja", name_bn: "দুর্গা পূজা",
        greeting_en: "Shubho Durga Puja!", greeting_bn: "শুভ দুর্গা পূজা!",
        start_date: "2025-10-02", end_date: "2025-10-07",
        gradient_from: "#c2410c", gradient_to: "#991b1b",
        accent_color: "30 90% 50%",
        decoration_type: "lights", animation_type: "particles",
        is_ramadan: false, enabled: true,
        banner_text_en: "Celebrate the triumph of good over evil",
        banner_text_bn: "অশুভের বিরুদ্ধে শুভের জয় উদযাপন",
      },
    ];

    // Check existing
    const { data: existing } = await supabaseAdmin
      .from("festival_themes")
      .select("name");
    
    const existingNames = new Set((existing || []).map((e: any) => e.name));
    const toInsert = festivals.filter(f => !existingNames.has(f.name));

    if (toInsert.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "All festivals already exist", count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error } = await supabaseAdmin
      .from("festival_themes")
      .insert(toInsert);

    if (error) throw error;

    // Now upload images from URLs if provided in request body
    return new Response(
      JSON.stringify({ success: true, message: `Inserted ${toInsert.length} festivals`, inserted: toInsert.map(f => f.name) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
