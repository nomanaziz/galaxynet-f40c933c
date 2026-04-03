import { Link } from "react-router-dom";
import { Shield, HeadphonesIcon, Star, CheckCircle, ArrowRight, Wifi, Server, Globe, Gamepad2, Building2, Camera, Network, MapPin, Search, Zap, DollarSign, Gauge, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import HowToSubscribe from "@/components/home/HowToSubscribe";
import CacheMarquee from "@/components/home/CacheMarquee";
import WhoWeAre from "@/components/home/WhoWeAre";
import PartnersSection from "@/components/home/PartnersSection";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import heroBanner from "@/assets/hero-banner.jpg";
import bannerFiber from "@/assets/banner-fiber.jpg";
import bannerGaming from "@/assets/banner-gaming.jpg";
import bannerSpeed from "@/assets/banner-speed.jpg";

const iconMap: Record<string, any> = {
  zap: Zap, headphones: HeadphonesIcon, gauge: Gauge, shield: Shield, wifi: Wifi,
  banknote: Banknote, dollar: DollarSign, globe: Globe, gamepad: Gamepad2,
  server: Server, star: Star, "building-2": Building2, camera: Camera, network: Network,
};

const Index = () => {
  const [coverageCheck, setCoverageCheck] = useState("");
  const { t } = useLanguage();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [features, setFeatures] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("site_settings").select("key, value").then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
      setSettings(map);
    });
    supabase.from("homepage_features").select("*").order("sort_order").then(({ data }) => setFeatures(data ?? []));
    supabase.from("packages").select("*").eq("visible", true).eq("featured", true).order("sort_order").then(({ data }) => setPackages(data ?? []));
    supabase.from("services").select("*").eq("visible", true).order("sort_order").limit(5).then(({ data }) => setServices(data ?? []));
    supabase.from("testimonials").select("*").eq("visible", true).order("sort_order").then(({ data }) => setTestimonials(data ?? []));
    supabase.from("partners").select("*").eq("visible", true).order("sort_order").then(({ data }) => setPartners(data ?? []));
  }, []);

  const trustStats = [
    { num: "99.9%", label: t("Uptime", "আপটাইম"), icon: Shield },
    { num: "10K+", label: t("Clients", "গ্রাহক"), icon: Wifi },
    { num: "50+", label: t("Areas", "এলাকা"), icon: MapPin },
    { num: "BDIX", label: t("Connected", "সংযুক্ত"), icon: Server },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />

      {/* Hero - Dark navy with background image */}
      <section className="relative overflow-hidden">
        <img src={heroBanner} alt="" className="absolute inset-0 w-full h-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(215,60%,8%,0.92)] via-[hsl(215,60%,12%,0.85)] to-[hsl(195,75%,22%,0.75)]" />
        <div className="container mx-auto px-4 py-16 md:py-28 relative z-10">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Galaxy Net</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4">
              {t(settings.hero_title_en || "Best Fiber Internet in Your Area", settings.hero_title_bn || "আপনার এলাকায় সেরা ফাইবার ইন্টারনেট")}
            </h1>
            <p className="text-white/70 text-base md:text-lg mb-6 max-w-lg">
              {t(settings.hero_subtitle_en || "Fast, reliable and affordable high-speed internet service", settings.hero_subtitle_bn || "দ্রুত, নির্ভরযোগ্য এবং সাশ্রয়ী মূল্যে হাই-স্পিড ইন্টারনেট সেবা")}
            </p>
            {/* Starting price badge */}
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-2 mb-6">
              <Banknote className="h-5 w-5 text-accent" />
              <span className="text-white text-sm font-medium">{t("Starting from", "শুরু")} <span className="text-accent font-bold text-lg">৳750</span>/{t("month", "মাস")}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={settings.hero_cta_url || "/coverage"}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-7 text-base">
                  {t(settings.hero_cta_text_en || "Check Coverage", settings.hero_cta_text_bn || "কভারেজ চেক")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/packages">
                <Button size="lg" variant="outline" className="font-semibold px-7 text-base border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  {t("View Packages", "প্যাকেজ দেখুন")}
                </Button>
              </Link>
              <Link to="/new-connection">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-7 text-base">
                  {t("New Connection", "নতুন সংযোগ")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-8 md:py-10 border-b border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trustStats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 justify-center p-3 rounded-xl bg-secondary/60">
                <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <s.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{s.num}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fiber Banner Strip */}
      <section className="relative h-24 md:h-32 overflow-hidden">
        <img src={bannerFiber} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" width={1920} height={512} />
        <div className="absolute inset-0 gradient-orange-strip opacity-60" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <p className="text-white font-bold text-lg md:text-2xl tracking-wide text-center px-4">
            {t("100% Fiber Optic Network — Ultra Fast & Reliable", "১০০% ফাইবার অপটিক নেটওয়ার্ক — আল্ট্রা ফাস্ট ও নির্ভরযোগ্য")}
          </p>
        </div>
      </section>

      {/* Why Choose Us — from DB */}
      {features.length > 0 && (
        <section className="py-10 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-primary mb-2">
                {t("Why Choose Galaxy Net?", "কেন গ্যালাক্সি নেট?")}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
                {t("Everything you need for a seamless internet experience", "নিরবচ্ছিন্ন ইন্টারনেট অভিজ্ঞতার জন্য যা কিছু দরকার")}
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
              {features.map((f) => {
                const Icon = iconMap[f.icon_name] || Star;
                return (
                  <Card key={f.id} className="group border hover:border-accent/40 transition-all hover:shadow-lg">
                    <CardContent className="p-3 md:p-6">
                      <div className="h-9 w-9 md:h-12 md:w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-accent group-hover:text-accent-foreground transition-colors" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">{t(f.title, f.title_bn || f.title)}</h3>
                      <p className="text-muted-foreground text-xs md:text-sm">{t(f.description, f.description_bn || f.description)}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services Preview */}
      <section className="py-12 md:py-14 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">{t("Our Services", "আমাদের সেবাসমূহ")}</h2>
          </div>
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible scrollbar-none">
            {services.map((s) => {
              const Icon = iconMap[s.icon_name] || Wifi;
              return (
                <div key={s.id} className="flex flex-col items-center p-5 rounded-xl bg-background border hover:border-accent/40 transition-all min-w-[110px] hover:shadow-sm shrink-0">
                  <Icon className="h-7 w-7 text-accent mb-2" />
                  <p className="font-medium text-foreground text-sm text-center">{t(s.title, s.title_bn || s.title)}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <Link to="/services">
              <Button variant="outline" className="font-semibold">
                {t("All Services", "সব সেবা")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gaming & Cache Banner */}
      <section className="relative h-48 md:h-56 overflow-hidden">
        <img src={bannerGaming} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" width={1920} height={512} />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(215,60%,8%,0.85)] to-[hsl(195,75%,22%,0.6)]" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {t("Ultimate Gaming & Streaming", "আলট্রা গেমিং ও স্ট্রিমিং")}
          </h3>
          <p className="text-white/60 text-sm md:text-base max-w-lg">
            {t("Low latency, high speed — perfect for gamers and content lovers", "কম লেটেন্সি, হাই স্পিড — গেমার ও কন্টেন্ট প্রেমীদের জন্য পারফেক্ট")}
          </p>
        </div>
      </section>

      {/* Cache Server Marquee */}
      <CacheMarquee />

      {/* Popular Packages — from DB */}
      <section className="py-10 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-2">{t("Popular Packages", "জনপ্রিয় প্যাকেজ")}</h2>
            <p className="text-muted-foreground text-sm md:text-base">{t("Choose the perfect plan for you", "আপনার জন্য সেরা প্ল্যান বেছে নিন")}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto">
            {packages.map((pkg) => {
              const featureList = Array.isArray(pkg.features) ? pkg.features : [];
              return (
                <Card key={pkg.id} className={`relative overflow-hidden transition-all hover:shadow-lg ${pkg.popular ? "border-accent shadow-md ring-1 ring-accent/20" : "border hover:border-accent/40"}`}>
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-bl-lg">
                      {t("POPULAR", "জনপ্রিয়")}
                    </div>
                  )}
                  <CardContent className="p-3 md:p-6">
                    <h3 className="text-base md:text-xl font-bold text-foreground">{t(pkg.name, pkg.name_bn || pkg.name)}</h3>
                    <div className="my-2 md:my-3"><span className="text-xl md:text-3xl font-bold text-foreground">{pkg.speed} Mbps</span></div>
                    <div className="mb-3 md:mb-4 p-2 md:p-3 rounded-lg bg-accent/8 border border-accent/30">
                      <span className="text-lg md:text-2xl font-bold text-accent">৳{pkg.price}</span>
                      <span className="text-muted-foreground text-xs md:text-sm">/{t("month", "মাস")}</span>
                    </div>
                    <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                      {featureList.map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-accent shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Link to="/packages">
                      <Button variant="outline" className="w-full font-semibold text-xs md:text-sm">
                        {t("View Details", "বিস্তারিত")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {packages.length === 0 && (
            <p className="text-center text-muted-foreground">{t("No packages available.", "কোনো প্যাকেজ নেই।")}</p>
          )}
          <div className="text-center mt-10">
            <Link to="/packages">
              <Button size="lg" variant="outline" className="font-semibold">
                {t("See All Plans", "সব প্ল্যান দেখুন")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Speed Banner */}
      <section className="relative h-40 md:h-48 overflow-hidden">
        <img src={bannerSpeed} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" width={1920} height={512} />
        <div className="absolute inset-0 bg-gradient-to-l from-[hsl(215,60%,8%,0.8)] to-[hsl(25,100%,50%,0.3)]" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {t("Blazing Fast Speeds up to 1 Gbps", "১ Gbps পর্যন্ত অবিশ্বাস্য গতি")}
          </h3>
          <p className="text-white/60 text-sm">{t("Experience the difference with fiber optic technology", "ফাইবার অপটিক প্রযুক্তিতে পার্থক্য অনুভব করুন")}</p>
        </div>
      </section>

      {/* Coverage CTA */}
      <section className="py-14 bg-secondary/50">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">{t("Check If We're In Your Area", "আপনার এলাকায় আমরা আছি কিনা দেখুন")}</h2>
          <div className="flex gap-3 mt-6">
            <Input placeholder={t("Enter your area...", "এলাকার নাম...")} value={coverageCheck} onChange={(e) => setCoverageCheck(e.target.value)} className="text-base" />
            <Link to={`/coverage?q=${encodeURIComponent(coverageCheck)}`}>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shrink-0">
                <Search className="h-4 w-4 mr-1" /> {t("Check", "চেক")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How to Subscribe */}
      <HowToSubscribe />

      {/* Testimonials — from DB */}
      {testimonials.length > 0 && (
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">{t("Customer Reviews", "গ্রাহকদের মতামত")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {testimonials.map((item) => (
                <Card key={item.id} className="border hover:border-accent/40 transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      "{t(item.text || "", item.text_bn || item.text || "")}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-accent font-bold text-sm">{(item.name || "?")[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{t(item.name, item.name_bn || item.name)}</p>
                        <p className="text-xs text-muted-foreground">{t(item.location || "", item.location_bn || item.location || "")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Who We Are */}
      <WhoWeAre />

      {/* Partners — from DB */}
      <PartnersSection partners={partners} />

      {/* CTA Banner */}
      <section className="hero-gradient text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("Ready to Get Connected?", "সংযুক্ত হতে প্রস্তুত?")}</h2>
          <p className="text-primary-foreground/70 text-lg mb-8">{t("Join thousands of happy customers today!", "আজই হাজারো সন্তুষ্ট গ্রাহকের সাথে যোগ দিন!")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/coverage">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8">
                {t("Check Coverage", "কভারেজ চেক")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/new-connection">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8">
                {t("New Connection", "নতুন সংযোগ")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
