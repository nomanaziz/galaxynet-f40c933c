import { Link } from "react-router-dom";
import { Wifi, Building2, Server, Camera, Network, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Wifi, title: t("Broadband Internet", "ব্রডব্যান্ড ইন্টারনেট"),
      desc: t("High-speed fiber optic broadband for homes with unlimited data and BDIX.", "বাড়ির জন্য আনলিমিটেড ডেটা ও BDIX সহ উচ্চ গতির ফাইবার অপটিক।"),
      features: [t("Up to 200 Mbps", "২০০ Mbps পর্যন্ত"), "BDIX + FTP", t("Unlimited Data", "আনলিমিটেড ডেটা"), t("Free Router", "ফ্রি রাউটার")],
      link: "/packages", badge: t("Most Popular", "সবচেয়ে জনপ্রিয়"),
    },
    {
      icon: Building2, title: t("Corporate Internet", "কর্পোরেট ইন্টারনেট"),
      desc: t("Dedicated bandwidth for businesses with guaranteed uptime SLA.", "ব্যবসার জন্য গ্যারান্টিড আপটাইম SLA সহ ডেডিকেটেড ব্যান্ডউইথ।"),
      features: [t("Dedicated Line", "ডেডিকেটেড লাইন"), "99.99% SLA", t("Static IP", "স্ট্যাটিক IP"), t("24/7 Support", "২৪/৭ সাপোর্ট")],
      link: "/packages", badge: "",
    },
    {
      icon: Server, title: t("Dedicated Bandwidth", "ডেডিকেটেড ব্যান্ডউইথ"),
      desc: t("Enterprise-grade solutions for ISPs and large organizations.", "ISP ও বড় প্রতিষ্ঠানের জন্য এন্টারপ্রাইজ-গ্রেড সমাধান।"),
      features: [t("1:1 Bandwidth", "১:১ ব্যান্ডউইথ"), t("Redundant Links", "রিডান্ড্যান্ট লিংক"), t("Custom SLA", "কাস্টম SLA")],
      link: "/contact", badge: t("Enterprise", "এন্টারপ্রাইজ"),
    },
    {
      icon: Camera, title: t("CCTV Solution", "সিসিটিভি সমাধান"),
      desc: t("Complete surveillance solutions with remote monitoring.", "রিমোট মনিটরিং সহ সম্পূর্ণ নজরদারি সমাধান।"),
      features: [t("IP Cameras", "IP ক্যামেরা"), t("NVR Setup", "NVR সেটআপ"), t("Remote Access", "রিমোট অ্যাক্সেস"), t("Cloud Storage", "ক্লাউড স্টোরেজ")],
      link: "/contact", badge: "",
    },
    {
      icon: Network, title: t("Network Setup", "নেটওয়ার্ক সেটআপ"),
      desc: t("Professional network infrastructure for offices and enterprises.", "অফিস ও এন্টারপ্রাইজের জন্য পেশাদার নেটওয়ার্ক ইনফ্রাস্ট্রাকচার।"),
      features: [t("Structured Cabling", "স্ট্রাকচার্ড ক্যাবলিং"), t("WiFi Setup", "ওয়াইফাই সেটআপ"), t("Firewall", "ফায়ারওয়াল")],
      link: "/contact", badge: "",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="page-hero">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{t("Our Services", "আমাদের সেবাসমূহ")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("Complete connectivity solutions for homes and businesses.", "বাড়ি ও ব্যবসার জন্য সম্পূর্ণ সংযোগ সমাধান।")}
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Card key={s.title} className="relative border hover:border-accent/40 transition-all hover:shadow-md group">
                {s.badge && (
                  <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {s.badge}
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                    <s.icon className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 mb-4">{s.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {s.features.map((f) => (
                      <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                  <Link to={s.link}>
                    <Button variant="outline" className="w-full font-semibold">
                      {t("Learn More", "বিস্তারিত")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
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
