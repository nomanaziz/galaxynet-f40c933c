import { useEffect, useState } from "react";
import { CreditCard, Loader2, ArrowRight, Zap, Wallet, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Payment = () => {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [clientCode, setClientCode] = useState("");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const { t, language } = useLanguage();

  useEffect(() => {
    Promise.all([
      supabase.from("payment_methods").select("*").eq("visible", true).order("sort_order"),
      supabase.from("site_settings").select("key, value"),
    ]).then(([methodsRes, settingsRes]) => {
      setMethods(methodsRes.data ?? []);
      const map: Record<string, string> = {};
      (settingsRes.data ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  const heroTitle = t(
    settings.payment_hero_title || "Pay Bill",
    settings.payment_hero_title_bn || "বিল পরিশোধ"
  );
  const heroSubtitle = t(
    settings.payment_hero_subtitle || "Quick and secure bill payment options for Galaxy Net subscribers.",
    settings.payment_hero_subtitle_bn || "গ্যালাক্সি নেট গ্রাহকদের জন্য দ্রুত ও নিরাপদ বিল পরিশোধের অপশন।"
  );
  const portalUrl = settings.payment_portal_url || "https://portal.galaxynetbd.com/BillPayment/Index";
  const quickPayEnabled = settings.payment_quick_pay_enabled !== "false";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar /><Navbar />

      {/* Hero Section - Gradient */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/80" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <Wallet className="h-4 w-4 text-white" />
            <span className="text-white/90 text-sm font-medium">{t("Secure Payments", "নিরাপদ পেমেন্ট")}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{heroTitle}</h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">{heroSubtitle}</p>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Shield className="h-4 w-4" />
              <span>{t("SSL Secured", "এসএসএল সুরক্ষিত")}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Clock className="h-4 w-4" />
              <span>{t("Instant Processing", "তাৎক্ষণিক প্রসেসিং")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Bill Pay */}
      {quickPayEnabled && (
        <section className="py-10 md:py-14 bg-accent/5 border-b border-border">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <div className="bg-card rounded-2xl shadow-lg border p-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">
                {t("Quick Bill Pay", "দ্রুত বিল পরিশোধ")}
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                {t("Enter your Client Code to pay your bill instantly.", "আপনার ক্লায়েন্ট কোড দিয়ে তাৎক্ষণিক বিল পরিশোধ করুন।")}
              </p>
              <div className="flex gap-3">
                <Input
                  placeholder={t("Client Code", "ক্লায়েন্ট কোড")}
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value)}
                  className="text-center text-lg font-mono h-12"
                />
                <Button
                  size="lg"
                  disabled={!clientCode.trim()}
                  onClick={() => window.open(portalUrl, "_blank")}
                  className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground h-12 px-6"
                >
                  {t("Pay Now", "বিল পরিশোধ")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Payment Methods Grid */}
      <section className="py-12 md:py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t("Payment Methods", "পেমেন্ট পদ্ধতি")}
            </h2>
            <p className="text-muted-foreground">
              {t("Choose your preferred payment method below.", "নিচে আপনার পছন্দের পেমেন্ট পদ্ধতি বেছে নিন।")}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : methods.length === 0 ? (
            <div className="text-center py-16">
              <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("No payment methods available.", "কোনো পেমেন্ট পদ্ধতি নেই।")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {methods.map((m) => (
                <Card
                  key={m.id}
                  className="overflow-hidden border hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div
                    className="h-36 flex items-center justify-center p-6 relative overflow-hidden"
                    style={{ backgroundColor: m.bg_color || 'hsl(var(--accent))' }}
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {m.logo_url ? (
                      <img src={m.logo_url} alt={m.name} className="max-h-16 max-w-full object-contain relative z-10 drop-shadow-lg" />
                    ) : (
                      <CreditCard className="h-14 w-14 text-white/80 relative z-10" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg text-foreground mb-1">
                      {language === "bn" && m.name_bn ? m.name_bn : m.name}
                    </h3>
                    {m.account_number && (
                      <p className="text-sm font-mono text-accent mb-2 bg-accent/5 rounded px-2 py-1 inline-block">
                        {m.account_number}
                      </p>
                    )}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {language === "bn" && m.instructions_bn ? m.instructions_bn : m.instructions}
                    </p>
                    <Button
                      className="w-full group/btn"
                      style={{ backgroundColor: m.bg_color || undefined }}
                      onClick={() => {
                        if (m.button_url) {
                          window.open(m.button_url, "_blank");
                        } else {
                          setSelectedMethod(m);
                        }
                      }}
                    >
                      {language === "bn" && m.button_text_bn
                        ? m.button_text_bn
                        : m.button_text || t("Learn More", "বিস্তারিত জানুন")}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={!!selectedMethod} onOpenChange={() => setSelectedMethod(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedMethod?.logo_url && (
                <img src={selectedMethod.logo_url} alt="" className="h-8 w-8 object-contain" />
              )}
              {language === "bn" && selectedMethod?.name_bn ? selectedMethod.name_bn : selectedMethod?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMethod?.account_number && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">{t("Account Number", "অ্যাকাউন্ট নম্বর")}</p>
                <p className="text-lg font-mono font-bold text-foreground">{selectedMethod.account_number}</p>
              </div>
            )}
            {selectedMethod?.screenshot_url && (
              <img src={selectedMethod.screenshot_url} alt="Payment instructions" className="w-full rounded-lg border" />
            )}
            <p className="text-muted-foreground text-sm">
              {language === "bn" && selectedMethod?.instructions_bn ? selectedMethod.instructions_bn : selectedMethod?.instructions}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Payment;
