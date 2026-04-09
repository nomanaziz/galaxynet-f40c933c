import { useEffect, useState } from "react";
import { CreditCard, Loader2, ArrowRight, AlertTriangle, Smartphone, Globe, Building2, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  return match?.[1] || null;
};

const VideoEmbed = ({ url }: { url: string }) => {
  const { t } = useLanguage();
  const videoId = getYouTubeId(url);
  if (!videoId) return null;
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
        ▶ {t("Watch Tutorial Video", "টিউটোরিয়াল ভিডিও দেখুন")}
      </h3>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Tutorial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </>
    </>
  );
};

const categoryIcons: Record<string, { icon: any; label: string; labelBn: string }> = {
  mobile_banking: { icon: Smartphone, label: "Mobile Banking", labelBn: "মোবাইল ব্যাংকিং" },
  online_payment: { icon: Globe, label: "Online Payment", labelBn: "অনলাইন পেমেন্ট" },
  bank_transfer: { icon: Building2, label: "Bank Transfer", labelBn: "ব্যাংক ট্রান্সফার" },
  ussd: { icon: Hash, label: "USSD Code", labelBn: "ইউএসএসডি কোড" },
};

const Payment = () => {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    Promise.all([
      supabase.from("payment_methods").select("*").eq("visible", true).order("sort_order"),
      supabase.from("site_settings").select("key, value"),
    ]).then(([methodsRes, settingsRes]) => {
      const data = methodsRes.data ?? [];
      setMethods(data);
      const map: Record<string, string> = {};
      (settingsRes.data ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
      setSettings(map);
      // Set first mobile banking tab
      const mobileMethods = data.filter((m: any) => m.category === "mobile_banking");
      if (mobileMethods.length > 0) setActiveTab(mobileMethods[0].id);
      setLoading(false);
    });
  }, []);

  const portalUrl = settings.payment_portal_url || "https://portal.galaxynetbd.com/BillPayment/Index";
  const heroTitle = t(settings.payment_hero_title || "Quick Pay", settings.payment_hero_title_bn || "কুইক পে");
  const heroSubtitle = t(
    settings.payment_hero_subtitle || "Make your payment instantly using bKash, Nagad, Master Card, Visa card and other methods. Pay your renewal fee and new connection fees instantly.",
    settings.payment_hero_subtitle_bn || "বিকাশ, নগদ, মাস্টার কার্ড, ভিসা কার্ড এবং অন্যান্য পদ্ধতিতে তাৎক্ষণিক পেমেন্ট করুন।"
  );
  const phone = settings.phone || "+880 1700-000000";
  const email = settings.email || "info@galaxynet.com.bd";

  const mobileBanking = methods.filter(m => m.category === "mobile_banking");
  const onlinePayment = methods.filter(m => m.category === "online_payment");
  const bankTransfer = methods.filter(m => m.category === "bank_transfer");
  const ussdMethods = methods.filter(m => m.category === "ussd");
  const activeMethod = mobileBanking.find(m => m.id === activeTab);

  // Which categories exist
  const hasCategories = Object.keys(categoryIcons).filter(cat => methods.some(m => m.category === cat));

  if (loading) {
    return (
      <>
        
        <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></>
      </>
    );
  }

  return (
    <>
      

      {/* Quick Pay Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
        <div className="container mx-auto px-4 py-10 md:py-14 relative">
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-accent mb-3">{heroTitle}</h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{heroSubtitle}</p>
              </>
              <Button
                size="lg"
                onClick={() => window.open(portalUrl, "_blank")}
                className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-base font-bold rounded-lg"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {t("PAY NOW", "পে করুন")}
              </Button>
            </CardContent>
          </Card>
        </>
      </section>

      {/* How to Pay? */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-10 bg-accent rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("How to", "কিভাবে")} <span className="text-accent">{t("pay?", "পে করবেন?")}</span>
            </h2>
          </>
          <p className="text-muted-foreground mb-8 ml-4">
            {t("Step-by-step guide to making an online payment", "অনলাইন পেমেন্ট করার ধাপে ধাপে গাইড")}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hasCategories.map((cat) => {
              const cfg = categoryIcons[cat];
              const Icon = cfg.icon;
              return (
                <div key={cat} className="flex items-center gap-3 p-4 rounded-xl border border-accent/20 bg-accent/5 hover:border-accent/40 transition-colors">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-accent" />
                  </>
                  <span className="font-semibold text-foreground text-sm">
                    {t(cfg.label, cfg.labelBn)}
                  </span>
                </>
              );
            })}
          </>
        </>
      </section>

      {/* Pay bill with mobile banking */}
      {mobileBanking.length > 0 && (
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-10 bg-accent rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("Pay bill with", "বিল পরিশোধ করুন")} <span className="text-accent">{t("mobile banking", "মোবাইল ব্যাংকিং দিয়ে")}</span>
              </h2>
            </>
            <p className="text-muted-foreground mb-8 ml-4">
              {t("You can pay with Mobile banking by following these instructions", "এই নির্দেশনা অনুসরণ করে মোবাইল ব্যাংকিং দিয়ে পেমেন্ট করতে পারবেন")}
            </p>

            {/* Tabs */}
            <div className="flex gap-3 mb-8">
              {mobileBanking.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                    activeTab === m.id
                      ? "text-accent-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  style={activeTab === m.id ? { backgroundColor: m.bg_color || "hsl(var(--accent))" } : undefined}
                >
                  {language === "bn" && m.name_bn ? m.name_bn : m.name}
                </button>
              ))}
            </>

            {/* Tab Content */}
            {activeMethod && (
              <div className="bg-card rounded-xl border p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    {activeMethod.instructions && (
                      <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                        {language === "bn" && activeMethod.instructions_bn ? activeMethod.instructions_bn : activeMethod.instructions}
                      </>
                    )}
                    {activeMethod.account_number && (
                      <div className="mt-4 bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">{t("Account/Merchant Number", "অ্যাকাউন্ট/মার্চেন্ট নম্বর")}</p>
                        <p className="text-lg font-mono font-bold text-foreground">{activeMethod.account_number}</p>
                      </>
                    )}
              </>
                  {activeMethod.screenshot_url && (
                    <div className="md:w-80 shrink-0">
                      <img src={activeMethod.screenshot_url} alt="" className="w-full rounded-lg border" />
                    </>
                  )}
                </>
                {activeMethod.video_url && <VideoEmbed url={activeMethod.video_url} />}
              </>
            )}
          </>
        </section>
      )}

      {/* Portal Payment / Online Payment */}
      {onlinePayment.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-10 bg-accent rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("Portal payment", "পোর্টাল পেমেন্ট")} <span className="text-accent">{t("options", "অপশন")}</span>
              </h2>
            </>
            <p className="text-muted-foreground mb-6">
              {t("You can pay online with other suitable payment methods", "অন্যান্য উপযুক্ত পদ্ধতিতে অনলাইনে পেমেন্ট করতে পারবেন")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {onlinePayment.map((m) => (
                <Card key={m.id} className="overflow-hidden border hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedMethod(m)}>
                  <div className="h-32 flex items-center justify-center p-4" style={{ backgroundColor: m.bg_color || "hsl(var(--accent))" }}>
                    {m.logo_url ? (
                      <img src={m.logo_url} alt={m.name} className="max-h-16 max-w-full object-contain" />
                    ) : (
                      <Globe className="h-12 w-12 text-white" />
                    )}
                  </>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-bold text-foreground">{language === "bn" && m.name_bn ? m.name_bn : m.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </>
          </>
        </section>
      )}

      {/* Direct Bank Transfer */}
      {bankTransfer.length > 0 && (
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-10 bg-accent rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("Direct bank", "সরাসরি ব্যাংক")} <span className="text-accent">{t("transfer", "ট্রান্সফার")}</span>
              </h2>
            </>
            <p className="text-muted-foreground mb-8 ml-4">
              {t("You can pay us with direct bank transfer", "সরাসরি ব্যাংক ট্রান্সফারের মাধ্যমে পেমেন্ট করতে পারবেন")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bankTransfer.map((m) => (
                <Card key={m.id} className="overflow-hidden border">
                  <div className="h-20 flex items-center justify-center p-4" style={{ backgroundColor: m.bg_color || "hsl(var(--primary))" }}>
                    {m.logo_url ? (
                      <img src={m.logo_url} alt={m.name} className="max-h-10 max-w-full object-contain" />
                    ) : (
                      <Building2 className="h-8 w-8 text-white" />
                    )}
                  </>
                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-bold text-foreground text-lg">{language === "bn" && m.name_bn ? m.name_bn : m.name}</h3>
                    {m.account_number && (
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span className="text-sm text-muted-foreground">{t("Account No:", "অ্যাকাউন্ট নং:")}</span>
                        <span className="font-mono font-bold text-foreground">{m.account_number}</span>
                      </>
                    )}
                    {m.instructions && (
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {language === "bn" && m.instructions_bn ? m.instructions_bn : m.instructions}
                      </p>
                    )}
                    {m.video_url && <VideoEmbed url={m.video_url} />}
                  </CardContent>
                </Card>
              ))}
            </>
          </>
        </section>
      )}

      {/* USSD Code */}
      {ussdMethods.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-10 bg-accent rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("USSD Code", "ইউএসএসডি কোড")} <span className="text-accent">{t("payment", "পেমেন্ট")}</span>
              </h2>
            </>
            <p className="text-muted-foreground mb-8 ml-4">
              {t("Pay your bill using USSD codes from your phone", "আপনার ফোন থেকে USSD কোড ব্যবহার করে বিল পরিশোধ করুন")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ussdMethods.map((m) => (
                <Card key={m.id} className="overflow-hidden border">
                  <div className="h-20 flex items-center justify-center p-4" style={{ backgroundColor: m.bg_color || "hsl(var(--primary))" }}>
                    {m.logo_url ? (
                      <img src={m.logo_url} alt={m.name} className="max-h-10 max-w-full object-contain" />
                    ) : (
                      <Hash className="h-8 w-8 text-white" />
                    )}
                  </>
                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-bold text-foreground text-lg">{language === "bn" && m.name_bn ? m.name_bn : m.name}</h3>
                    {m.account_number && (
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span className="text-sm text-muted-foreground">{t("Code:", "কোড:")}</span>
                        <span className="font-mono font-bold text-foreground">{m.account_number}</span>
                      </>
                    )}
                    {m.instructions && (
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {language === "bn" && m.instructions_bn ? m.instructions_bn : m.instructions}
                      </p>
                    )}
                    {m.video_url && <VideoEmbed url={m.video_url} />}
                    {m.button_url && (
                      <Button className="w-full mt-2" variant="outline" onClick={() => window.open(m.button_url!, "_blank")}>
                        {language === "bn" && m.button_text_bn ? m.button_text_bn : m.button_text || t("Learn More", "বিস্তারিত")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          </>
        </section>
      )}

      {/* Disclaimer */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6 bg-accent/10 rounded-xl p-6 md:p-8">
            <div className="shrink-0">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-xl bg-accent/20 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-accent" />
              </>
            </>
            <div>
              <p className="text-foreground font-semibold text-base md:text-lg mb-2">
                {t(
                  settings.payment_helpline_text || "For any payment related issues, please contact our helpline.",
                  settings.payment_helpline_text_bn || "যেকোনো পেমেন্ট সংক্রান্ত সমস্যায় আমাদের হেল্পলাইনে যোগাযোগ করুন।"
                )}
              </p>
              <p className="text-foreground font-bold">
                {t("Helpline number:", "হেল্পলাইন নম্বর:")} {phone}
              </p>
              <p className="text-foreground font-bold">
                {t("E-Mail:", "ই-মেইল:")} {email}
              </p>
            </>
          </>
        </>
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
              </>
            )}
            {selectedMethod?.screenshot_url && (
              <img src={selectedMethod.screenshot_url} alt="Payment instructions" className="w-full rounded-lg border" />
            )}
            {selectedMethod?.instructions && (
              <p className="text-muted-foreground text-sm whitespace-pre-line">
                {language === "bn" && selectedMethod?.instructions_bn ? selectedMethod.instructions_bn : selectedMethod.instructions}
              </p>
            )}
            {selectedMethod?.video_url && <VideoEmbed url={selectedMethod.video_url} />}
            {selectedMethod?.button_url && (
              <Button className="w-full" onClick={() => window.open(selectedMethod.button_url, "_blank")}>
                {language === "bn" && selectedMethod?.button_text_bn ? selectedMethod.button_text_bn : selectedMethod?.button_text || t("Pay Now", "পে করুন")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default Payment;
