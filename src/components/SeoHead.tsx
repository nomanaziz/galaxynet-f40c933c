import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Reads SEO settings from site_settings and injects:
 *  - GA4 gtag.js (ga_measurement_id, e.g. G-XXXXXXXXXX)
 *  - Google Search Console verification meta (google_site_verification)
 *  - Bing Webmaster verification meta (bing_site_verification)
 */
const SeoHead = () => {
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["ga_measurement_id", "google_site_verification", "bing_site_verification"])
      .then(({ data }) => {
        if (cancelled || !data) return;
        const map: Record<string, string> = {};
        data.forEach((s: any) => { map[s.key] = (s.value ?? "").trim(); });

        if (map.google_site_verification) {
          upsertMeta("google-site-verification", map.google_site_verification);
        }
        if (map.bing_site_verification) {
          upsertMeta("msvalidate.01", map.bing_site_verification);
        }

        const gaId = map.ga_measurement_id;
        if (gaId && /^G-[A-Z0-9]+$/i.test(gaId) && !document.getElementById("ga4-loader")) {
          const s1 = document.createElement("script");
          s1.id = "ga4-loader";
          s1.async = true;
          s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          document.head.appendChild(s1);

          const s2 = document.createElement("script");
          s2.id = "ga4-init";
          s2.text = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`;
          document.head.appendChild(s2);
        }
      });
    return () => { cancelled = true; };
  }, []);

  return null;
};

function upsertMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

export default SeoHead;
