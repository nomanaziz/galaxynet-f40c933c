import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wifi, Building2, Server, Camera, Network, ArrowRight, Shield, Zap, Globe, LucideIcon, MonitorSmartphone, Radio, Smartphone, Cpu, HardDrive, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PageHeroDark from "@/components/PageHeroDark";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import breadcrumbImg from "@/assets/breadcrumb-network.jpg";

const iconMap: Record<string, LucideIcon> = {
  wifi: Wifi, "building-2": Building2, server: Server, camera: Camera, network: Network,
  shield: Shield, zap: Zap, globe: Globe, "monitor-smartphone": MonitorSmartphone,
  radio: Radio, smartphone: Smartphone, cpu: Cpu, "hard-drive": HardDrive, cloud: Cloud,
};

const Services = () => {
  const { t } = useLanguage();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("services").select("*").eq("visible", true).order("sort_order")
      .then(({ data }) => { setServices(data ?? []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />

      <PageHeroDark
        title="Our Services"
        titleBn="আমাদের সেবাসমূহ"
        subtitle="Complete connectivity solutions for homes and businesses."
        subtitleBn="বাড়ি ও ব্যবসার জন্য সম্পূর্ণ সংযোগ সমাধান।"
        bgImage={breadcrumbImg}
      />
        </div>
      </section>

      {/* Highlights */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Zap, label: "99.9% Uptime" },
              { icon: Globe, label: "BDIX Connected" },
              { icon: Shield, label: t("Secure Network", "সুরক্ষিত নেটওয়ার্ক") },
              { icon: Server, label: "FTP Server" },
            ].map((h) => (
              <div key={h.label} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <h.icon className="h-4 w-4 text-accent" /> {h.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => {
                const Icon = iconMap[s.icon_name] || Wifi;
                const features = (s.features || []) as Array<{ en: string; bn: string }>;
                const badge = t(s.badge, s.badge_bn);
                return (
                  <Card key={s.id} className="relative border hover:border-accent/40 transition-all hover:shadow-md group">
                    {badge && (
                      <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                        {badge}
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                        <Icon className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{t(s.title, s.title_bn)}</h3>
                      <p className="text-muted-foreground text-sm mt-2 mb-4">{t(s.description, s.description_bn)}</p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {features.map((f, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{t(f.en, f.bn)}</Badge>
                        ))}
                      </div>
                      <Link to={s.link || "/contact"}>
                        <Button variant="outline" className="w-full font-semibold">
                          {t("Learn More", "বিস্তারিত")} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">{t("Need a Custom Solution?", "কাস্টম সমাধান দরকার?")}</h2>
          <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
            {t("Our team can design a tailored solution for your needs.", "আমাদের দল আপনার প্রয়োজন অনুযায়ী সমাধান তৈরি করতে পারে।")}
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8">
              {t("Contact Us", "যোগাযোগ করুন")} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
