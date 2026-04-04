import { useEffect, useState } from "react";
import { Gift, Calendar, Tag, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PageHeroDark from "@/components/PageHeroDark";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import breadcrumbImg from "@/assets/breadcrumb-offers.jpg";
import offerReferFriend from "@/assets/offer-refer-friend.jpg";
import offer500Discount from "@/assets/offer-500-discount.jpg";
import offerFreeConnection from "@/assets/offer-free-connection.jpg";
import offer1000Discount from "@/assets/offer-1000-discount.jpg";

const FALLBACK_IMAGES: Record<string, string> = {
  "Make a Referral and Earn BDT 500!": offerReferFriend,
  "500 BDT Discount on Connection Charge": offer500Discount,
  "Free Connection Charge on 4 Months Advance Payment": offerFreeConnection,
  "1000 BDT Discount on Connection Charge": offer1000Discount,
};

const typeConfig: Record<string, { label: string; labelBn: string; color: string }> = {
  offer: { label: "Offer", labelBn: "অফার", color: "bg-green-100 text-green-700" },
  referral: { label: "Referral", labelBn: "রেফারেল", color: "bg-blue-100 text-blue-700" },
  coupon: { label: "Coupon", labelBn: "কুপন", color: "bg-purple-100 text-purple-700" },
};

const Offers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    supabase.from("offers").select("*").eq("active", true).order("created_at", { ascending: false }).then(({ data }) => {
      const now = new Date();
      const active = (data ?? []).filter(o => !o.expiry_date || new Date(o.expiry_date) >= now);
      setOffers(active);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar /><Navbar />

      <PageHeroDark
        title="Offers & Promotions"
        titleBn="অফার ও প্রমোশন"
        subtitle="Don't miss our latest deals and promotions!"
        subtitleBn="আমাদের সর্বশেষ ডিল ও প্রমোশন মিস করবেন না!"
        bgImage={breadcrumbImg}
      />

      <section className="py-12 md:py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : offers.length === 0 ? (
            <div className="text-center py-16">
              <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">{t("No offers at this time. Check back soon!", "এই মুহূর্তে কোনো অফার নেই। শীঘ্রই আবার দেখুন!")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => {
                const cfg = typeConfig[offer.type] || typeConfig.offer;
                const expired = offer.expiry_date && new Date(offer.expiry_date) < new Date();
                return (
                  <Card key={offer.id} className="border hover:border-accent/40 transition-all">
                    {offer.image_url && (
                      <img src={offer.image_url} alt={offer.title} className="w-full h-48 object-cover rounded-t-lg" />
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`${cfg.color} border-0`}>
                          <Tag className="h-3 w-3 mr-1" /> {t(cfg.label, cfg.labelBn)}
                        </Badge>
                        {offer.expiry_date && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {expired ? t("Expired", "মেয়াদ শেষ") : `${t("Until", "পর্যন্ত")} ${new Date(offer.expiry_date).toLocaleDateString()}`}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{t(offer.title, offer.title_bn || offer.title)}</h3>
                      {offer.description && (
                        <p className="text-muted-foreground text-sm mt-2">{t(offer.description, offer.description_bn || offer.description)}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Offers;
