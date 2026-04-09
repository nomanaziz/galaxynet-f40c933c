import { useEffect, useState } from "react";
import { Gift, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Offers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const { t, language } = useLanguage();

  useEffect(() => {
    Promise.all([
      supabase.from("offers").select("*").eq("active", true).order("created_at", { ascending: false }),
      supabase.from("site_settings").select("key, value"),
    ]).then(([offersRes, settingsRes]) => {
      const now = new Date();
      const active = (offersRes.data ?? []).filter(o => !o.expiry_date || new Date(o.expiry_date) >= now);
      setOffers(active);
      const map: Record<string, string> = {};
      (settingsRes.data ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  const phone = settings.phone || "+880 1700-000000";
  const email = settings.email || "info@galaxynet.com.bd";

  return (
    <>
      

      <section className="py-12 md:py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-10 bg-accent rounded-full" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("Latest", "সর্বশেষ")} <span className="text-accent">{t("offers", "অফার")}</span>
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : offers.length === 0 ? (
            <div className="text-center py-16">
              <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">{t("No offers at this time. Check back soon!", "এই মুহূর্তে কোনো অফার নেই। শীঘ্রই আবার দেখুন!")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {offers.map((offer) => (
                <Card key={offer.id} className="overflow-hidden border hover:shadow-lg transition-all group">
                  {offer.image_url && (
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
                  <CardContent className="p-5">
                    <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2">
                      {language === "bn" && offer.title_bn ? offer.title_bn : offer.title}
                    </h3>
                    {offer.description && (
                      <p className="text-muted-foreground text-sm line-clamp-4">
                        {language === "bn" && offer.description_bn ? offer.description_bn : offer.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Disclaimer Section */}
          <div className="mt-16 flex flex-col md:flex-row items-center gap-6 bg-accent/10 rounded-xl p-6 md:p-8">
            <div className="shrink-0">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-xl bg-accent/20 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-accent" />
              </div>
            </div>
            <div>
              <p className="text-foreground font-semibold text-base md:text-lg mb-2">
                {t(
                  "The type of the offer and the validity can be changed anytime based on the situation.",
                  "অফারের ধরন এবং মেয়াদ পরিস্থিতি অনুযায়ী যেকোনো সময় পরিবর্তন হতে পারে।"
                )}
              </p>
              <p className="text-foreground font-bold">
                {t("Helpline number:", "হেল্পলাইন নম্বর:")} {phone}
              </p>
              <p className="text-foreground font-bold">
                {t("E-Mail:", "ই-মেইল:")} {email}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Offers;
