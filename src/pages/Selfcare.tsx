import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Selfcare = () => {
  const { t } = useLanguage();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("site_settings").select("key, value").in("key", ["selfcare_url", "selfcare_enabled"]).then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
      if (map.selfcare_enabled === "true") setUrl(map.selfcare_url || "");
      setLoading(false);
    });
  }, []);

  return (
    <>
      

      <section className="page-hero">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{t("Selfcare Portal", "সেলফকেয়ার পোর্টাল")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t("Manage your account, check bills, and more.", "আপনার অ্যাকাউন্ট পরিচালনা করুন, বিল দেখুন এবং আরও অনেক কিছু।")}
          </p>
        </>
      </section>

      <section className="py-20 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-md text-center">
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
          ) : url ? (
            <>
              <div className="h-20 w-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Monitor className="h-10 w-10 text-accent" />
              </>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("Access Your Account", "আপনার অ্যাকাউন্টে প্রবেশ করুন")}</h2>
              <p className="text-muted-foreground mb-6">{t("Click the button below to open the selfcare portal.", "সেলফকেয়ার পোর্টাল খুলতে নিচের বোতামে ক্লিক করুন।")}</p>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8">
                  {t("Open Portal", "পোর্টাল খুলুন")} <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </>
          ) : (
            <p className="text-muted-foreground">{t("Selfcare portal is currently unavailable.", "সেলফকেয়ার পোর্টাল বর্তমানে উপলব্ধ নেই।")}</p>
          )}
        </>
      </section>

    </>
  );
};

export default Selfcare;
