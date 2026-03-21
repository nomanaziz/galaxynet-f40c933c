import { useState } from "react";
import { CheckCircle, Zap, Server, Globe, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const homePlans = [
  { name: "Home Basic", nameBn: "হোম বেসিক", speed: 10, price: "500", tag: "", features: ["Unlimited Data", "Email Support", "1 Device", "Standard Router"], badges: ["BDIX"] },
  { name: "Home Standard", nameBn: "হোম স্ট্যান্ডার্ড", speed: 50, price: "900", tag: "popular", features: ["Unlimited Data", "24/7 Support", "5 Devices", "Free Router", "Free Installation"], badges: ["BDIX", "FTP"] },
  { name: "Home Premium", nameBn: "হোম প্রিমিয়াম", speed: 100, price: "1500", tag: "", features: ["Unlimited Data", "Priority 24/7 Support", "Unlimited Devices", "Free Router + Setup", "Static IP Available"], badges: ["BDIX", "FTP", "Cache"] },
  { name: "Home Ultra", nameBn: "হোম আলট্রা", speed: 200, price: "2500", tag: "value", features: ["Unlimited Data", "VIP Support", "Unlimited Devices", "Premium Router + Setup", "Static IP", "1 Month Free"], badges: ["BDIX", "FTP", "Cache"] },
];

const businessPlans = [
  { name: "Business Starter", nameBn: "বিজনেস স্টার্টার", speed: 100, price: "3000", tag: "", features: ["Unlimited Data", "Business Support 9–9", "5 Users", "Free Router", "SLA 99.5%"], badges: ["BDIX", "FTP"] },
  { name: "Business Pro", nameBn: "বিজনেস প্রো", speed: 300, price: "6000", tag: "popular", features: ["Unlimited Data", "24/7 Priority Support", "20 Users", "Enterprise Router", "SLA 99.9%", "Static IP"], badges: ["BDIX", "FTP", "Cache"] },
  { name: "Business Enterprise", nameBn: "বিজনেস এন্টারপ্রাইজ", speed: 1000, price: "12000", tag: "", features: ["Unlimited Data", "Dedicated Account Manager", "Unlimited Users", "Enterprise-grade Router", "SLA 99.99%", "Multiple Static IPs", "Dedicated Line"], badges: ["BDIX", "FTP", "Cache", "Dedicated"] },
];

const badgeIcons: Record<string, typeof Server> = { BDIX: Server, FTP: Globe, Cache: MonitorPlay, Dedicated: Zap };

const PlanCard = ({ plan, t }: { plan: typeof homePlans[0]; t: (en: string, bn: string) => string }) => {
  const isPopular = !!plan.tag;
  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${isPopular ? "border-accent shadow-md ring-1 ring-accent/20" : "border hover:border-accent/40"}`}>
      {plan.tag && (
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
          {plan.tag === "popular" ? t("POPULAR", "জনপ্রিয়") : t("BEST VALUE", "সেরা মূল্য")}
        </div>
      )}
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground">{t(plan.name, plan.nameBn)}</h3>
        <div className="flex items-end gap-1 my-3">
          <span className="text-3xl font-bold text-foreground">{plan.speed >= 1000 ? `${plan.speed / 1000} Gbps` : `${plan.speed} Mbps`}</span>
        </div>
        <div className="mb-3 p-3 rounded-lg bg-accent/8">
          <span className="text-2xl font-bold text-accent">৳{plan.price}</span>
          <span className="text-muted-foreground text-sm">/{t("month", "মাস")}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {plan.badges.map((b) => {
            const Icon = badgeIcons[b] || Server;
            return (
              <Badge key={b} variant="secondary" className="text-xs flex items-center gap-1">
                <Icon className="h-3 w-3" /> {b}
              </Badge>
            );
          })}
        </div>
        <ul className="space-y-2 mb-6">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Link to="/contact">
          <Button variant={isPopular ? "default" : "outline"} className={`w-full font-semibold ${isPopular ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}`}>
            {t("Contact Us", "যোগাযোগ করুন")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const Packages = () => {
  const [speedFilter, setSpeedFilter] = useState([0]);
  const { t } = useLanguage();

  const filterPlans = (plans: typeof homePlans) => {
    const min = speedFilter[0];
    if (min === 0) return plans;
    return plans.filter((p) => p.speed >= min);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="page-hero">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{t("Internet Packages", "ইন্টারনেট প্যাকেজসমূহ")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t("Choose the perfect plan for your home or business. All plans include unlimited data!", "আপনার ঘর বা ব্যবসার জন্য সেরা প্ল্যান বেছে নিন।")}
          </p>
        </div>
      </section>

      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="home" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="h-11 p-1">
                <TabsTrigger value="home" className="px-5 text-sm font-medium">
                  {t("Home Plans", "হোম প্ল্যান")}
                </TabsTrigger>
                <TabsTrigger value="business" className="px-5 text-sm font-medium">
                  {t("Business Plans", "বিজনেস প্ল্যান")}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="max-w-sm mx-auto mb-10 p-4 rounded-xl bg-secondary border">
              <p className="text-sm font-medium text-foreground mb-2 text-center">
                {t("Filter by Speed", "গতি অনুযায়ী")}: {speedFilter[0] === 0 ? t("All", "সব") : `${speedFilter[0]}+ Mbps`}
              </p>
              <Slider value={speedFilter} onValueChange={setSpeedFilter} max={200} step={10} className="w-full" />
            </div>

            <TabsContent value="home">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filterPlans(homePlans).map((plan) => <PlanCard key={plan.name} plan={plan} t={t} />)}
              </div>
              {filterPlans(homePlans).length === 0 && (
                <p className="text-center text-muted-foreground py-8">{t("No plans match this speed range.", "এই গতির কোনো প্ল্যান নেই।")}</p>
              )}
            </TabsContent>

            <TabsContent value="business">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                {filterPlans(businessPlans).map((plan) => <PlanCard key={plan.name} plan={plan} t={t} />)}
              </div>
              {filterPlans(businessPlans).length === 0 && (
                <p className="text-center text-muted-foreground py-8">{t("No plans match this speed range.", "এই গতির কোনো প্ল্যান নেই।")}</p>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-12 p-6 rounded-xl bg-secondary border text-center">
            <p className="text-foreground font-semibold">{t("Need a custom plan?", "কাস্টম প্ল্যান দরকার?")}</p>
            <p className="text-muted-foreground text-sm mt-1">{t("Contact us for tailored solutions.", "কাস্টম সমাধানের জন্য যোগাযোগ করুন।")}</p>
            <Link to="/contact" className="inline-block mt-4">
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
