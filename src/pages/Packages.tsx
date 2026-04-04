import { useState, useEffect } from "react";
import { CheckCircle, Zap, Server, Globe, MonitorPlay, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PageHeroDark from "@/components/PageHeroDark";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import breadcrumbImg from "@/assets/breadcrumb-packages.jpg";

const badgeIcons: Record<string, typeof Server> = { BDIX: Server, FTP: Globe, Cache: MonitorPlay, Dedicated: Zap };

const PlanCard = ({ plan, t }: { plan: any; t: (en: string, bn: string) => string }) => {
  const featureList = Array.isArray(plan.features) ? plan.features : [];
  const badgeList = Array.isArray(plan.badges) ? plan.badges : [];
  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${plan.popular ? "border-accent shadow-md ring-1 ring-accent/20" : "border hover:border-accent/40"}`}>
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-2 sm:px-3 py-1 rounded-bl-lg">
          {t("POPULAR", "জনপ্রিয়")}
        </div>
      )}
      <CardContent className="p-3 sm:p-6">
        <h3 className="text-base sm:text-xl font-bold text-foreground">{t(plan.name, plan.name_bn || plan.name)}</h3>
        {plan.category !== "dedicated" && (
          <div className="flex items-end gap-1 my-2 sm:my-3">
            <span className="text-xl sm:text-3xl font-bold text-foreground">{plan.speed >= 1000 ? `${plan.speed / 1000} Gbps` : `${plan.speed} Mbps`}</span>
          </div>
        )}
        <div className="mb-2 sm:mb-3 p-2 sm:p-3 rounded-lg bg-accent/8 border border-accent/30">
          {plan.category === "dedicated" ? (
            <span className="text-lg sm:text-2xl font-bold text-accent">{t("Call for Price", "মূল্যের জন্য কল করুন")}</span>
          ) : (
            <>
              <span className="text-lg sm:text-2xl font-bold text-accent">৳{plan.price}</span>
              <span className="text-muted-foreground text-xs sm:text-sm">/{t("month", "মাস")}</span>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {badgeList.map((b: string) => {
            const Icon = badgeIcons[b] || Server;
            return (
              <Badge key={b} variant="secondary" className="text-xs flex items-center gap-1">
                <Icon className="h-3 w-3" /> {b}
              </Badge>
            );
          })}
        </div>
        <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
          {featureList.map((f: string, i: number) => (
            <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Link to="/new-connection">
          <Button variant={plan.popular ? "default" : "outline"} className={`w-full font-semibold ${plan.popular ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}`}>
            {t("Contact Us", "যোগাযোগ করুন")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const Packages = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    supabase.from("packages").select("*").eq("visible", true).order("sort_order").then(({ data }) => {
      setPackages(data ?? []);
      setLoading(false);
    });
  }, []);

  const filterPlans = (category: string) => packages.filter(p => p.category === category);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />

      <PageHeroDark
        title="Internet Packages"
        titleBn="ইন্টারনেট প্যাকেজসমূহ"
        subtitle="Choose the perfect plan for your home or business."
        subtitleBn="আপনার ঘর বা ব্যবসার জন্য সেরা প্ল্যান বেছে নিন।"
        bgImage={breadcrumbImg}
      />

      <section className="py-8 sm:py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : (
            <Tabs defaultValue="home" className="w-full">
              <div className="flex justify-center mb-4 sm:mb-6">
                <TabsList className="h-auto sm:h-11 p-1 flex-wrap">
                  <TabsTrigger value="home" className="px-5 text-sm font-medium">{t("Home Plans", "হোম প্ল্যান")}</TabsTrigger>
                  <TabsTrigger value="corporate" className="px-5 text-sm font-medium">{t("Corporate Plans", "কর্পোরেট প্ল্যান")}</TabsTrigger>
                  <TabsTrigger value="dedicated" className="px-5 text-sm font-medium">{t("Dedicated", "ডেডিকেটেড")}</TabsTrigger>
                </TabsList>
              </div>

              {["home", "corporate", "dedicated"].map(cat => (
                <TabsContent key={cat} value={cat}>
                  <div className={`grid grid-cols-1 ${cat === "dedicated" ? "sm:grid-cols-1 lg:grid-cols-1 max-w-lg mx-auto" : "sm:grid-cols-2 lg:grid-cols-4"} gap-5`}>
                    {filterPlans(cat).map(plan => <PlanCard key={plan.id} plan={plan} t={t} />)}
                  </div>
                  {filterPlans(cat).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">{t("No plans match this speed range.", "এই গতির কোনো প্ল্যান নেই।")}</p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}

          <div className="mt-12 p-6 rounded-xl bg-secondary border text-center">
            <p className="text-foreground font-semibold">{t("Need a custom plan?", "কাস্টম প্ল্যান দরকার?")}</p>
            <p className="text-muted-foreground text-sm mt-1">{t("Contact us for tailored solutions.", "কাস্টম সমাধানের জন্য যোগাযোগ করুন।")}</p>
            <Link to="/new-connection" className="inline-block mt-4">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                {t("Contact Us", "যোগাযোগ করুন")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Packages;
