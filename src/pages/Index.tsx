import { Link } from "react-router-dom";
import { Shield, HeadphonesIcon, DollarSign, Star, CheckCircle, ArrowRight, Wifi, Server, Globe, Gamepad2, Building2, Camera, Network, MapPin, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [coverageCheck, setCoverageCheck] = useState("");
  const { t } = useLanguage();

  const trustStats = [
    { num: "99.9%", label: t("Uptime", "আপটাইম"), icon: Shield },
    { num: "10K+", label: t("Clients", "গ্রাহক"), icon: Wifi },
    { num: "50+", label: t("Areas", "এলাকা"), icon: MapPin },
    { num: "BDIX", label: t("Connected", "সংযুক্ত"), icon: Server },
  ];

  const features = [
    { icon: Zap, title: t("High Speed Fiber", "উচ্চ গতির ফাইবার"), desc: t("Up to 1 Gbps fiber optic broadband", "১ Gbps পর্যন্ত ফাইবার অপটিক") },
    { icon: Shield, title: t("Unlimited Data", "আনলিমিটেড ডেটা"), desc: t("No data caps on any plan", "কোনো ডেটা সীমা নেই") },
    { icon: HeadphonesIcon, title: t("24/7 Support", "২৪/৭ সাপোর্ট"), desc: t("Expert help whenever you need", "যেকোনো সময় বিশেষজ্ঞ সহায়তা") },
    { icon: DollarSign, title: t("Affordable Plans", "সাশ্রয়ী প্ল্যান"), desc: t("Best value for your budget", "আপনার বাজেটের জন্য সেরা") },
    { icon: Globe, title: t("BDIX + FTP", "BDIX + FTP"), desc: t("Local content at maximum speed", "স্থানীয় কন্টেন্ট সর্বোচ্চ গতিতে") },
    { icon: Gamepad2, title: t("Low Latency", "কম লেটেন্সি"), desc: t("Optimized for gaming & streaming", "গেমিং ও স্ট্রিমিংয়ের জন্য অপ্টিমাইজড") },
  ];

  const servicesPreview = [
    { icon: Wifi, title: t("Broadband", "ব্রডব্যান্ড") },
    { icon: Building2, title: t("Corporate", "কর্পোরেট") },
    { icon: Camera, title: t("CCTV", "সিসিটিভি") },
    { icon: Network, title: t("Networking", "নেটওয়ার্কিং") },
    { icon: Server, title: t("Dedicated", "ডেডিকেটেড") },
  ];

  const packages = [
    { name: t("Basic", "বেসিক"), speed: "10 Mbps", price: "500", features: [t("Unlimited Data", "আনলিমিটেড ডেটা"), "BDIX", t("Email Support", "ইমেইল সাপোর্ট")] },
    { name: t("Standard", "স্ট্যান্ডার্ড"), speed: "50 Mbps", price: "900", popular: true, features: [t("Unlimited Data", "আনলিমিটেড ডেটা"), "BDIX + FTP", t("24/7 Support", "২৪/৭ সাপোর্ট"), t("Free Router", "ফ্রি রাউটার")] },
    { name: t("Premium", "প্রিমিয়াম"), speed: "100 Mbps", price: "1500", features: [t("Unlimited Data", "আনলিমিটেড ডেটা"), "BDIX + FTP", t("Priority Support", "অগ্রাধিকার সাপোর্ট"), t("Free Router + Setup", "ফ্রি রাউটার + সেটআপ")] },
  ];

  const testimonials = [
    { name: t("Rahim Uddin", "রহিম উদ্দিন"), location: t("Dhaka", "ঢাকা"), rating: 5, text: t("Galaxy Net has transformed my home internet. Super fast and never drops!", "গ্যালাক্সি নেট আমার হোম ইন্টারনেট বদলে দিয়েছে।") },
    { name: t("Fatema Khanam", "ফাতেমা খানম"), location: t("Chittagong", "চট্টগ্রাম"), rating: 5, text: t("Affordable pricing with excellent customer service. Highly recommended!", "সাশ্রয়ী মূল্যে চমৎকার গ্রাহক সেবা।") },
    { name: t("Karim Ahmed", "করিম আহমেদ"), location: t("Sylhet", "সিলেট"), rating: 5, text: t("Best ISP in our area. 24/7 support team is always ready to help.", "আমাদের এলাকার সেরা ISP।") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero — Modern split layout */}
      <section className="hero-gradient-soft relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div className="animate-fade-up">
              <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Galaxy Net</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-4">
                {t("Best Fiber Internet in", "আপনার এলাকায় সেরা")}{" "}
                <span className="text-accent">{t("Your Area", "ফাইবার ইন্টারনেট")}</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg">
                {t(
                  "Bangladesh's trusted ISP — connecting families and businesses with lightning-fast fiber broadband.",
                  "বাংলাদেশের বিশ্বস্ত ISP — পরিবার ও ব্যবসাকে দ্রুতগতির ফাইবার ব্রডব্যান্ডে সংযুক্ত করছে।"
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/coverage">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-7">
                    {t("Check Coverage", "কভারেজ চেক")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="font-semibold px-7">
                    {t("Contact Us", "যোগাযোগ করুন")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — Abstract illustration */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 rounded-full bg-accent/5 animate-pulse" />
                <div className="absolute inset-6 rounded-full bg-accent/8" />
                <div className="absolute inset-12 rounded-full bg-accent/12 flex items-center justify-center">
                  <div className="relative">
                    <Wifi className="h-20 w-20 text-accent" />
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-green-400 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                {/* Floating dots */}
                <div className="absolute top-4 right-8 h-3 w-3 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="absolute bottom-8 left-4 h-4 w-4 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: "0.5s" }} />
                <div className="absolute top-1/2 right-0 h-2 w-2 rounded-full bg-accent/30 animate-bounce" style={{ animationDelay: "0.8s" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustStats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 justify-center">
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

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t("Why Choose Galaxy Net?", "কেন গ্যালাক্সি নেট?")}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t("Everything you need for a seamless internet experience", "নিরবচ্ছিন্ন ইন্টারনেট অভিজ্ঞতার জন্য যা কিছু দরকার")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="group border hover:border-accent/40 transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <f.icon className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-1">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-14 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">{t("Our Services", "আমাদের সেবাসমূহ")}</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {servicesPreview.map((s) => (
              <div key={s.title} className="flex flex-col items-center p-5 rounded-xl bg-background border hover:border-accent/40 transition-all min-w-[110px] hover:shadow-sm">
                <s.icon className="h-7 w-7 text-accent mb-2" />
                <p className="font-medium text-foreground text-sm">{s.title}</p>
              </div>
            ))}
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

      {/* Popular Packages */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("Popular Packages", "জনপ্রিয় প্যাকেজ")}</h2>
            <p className="text-muted-foreground">{t("Choose the perfect plan for you", "আপনার জন্য সেরা প্ল্যান বেছে নিন")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {packages.map((pkg) => (
              <Card key={pkg.name} className={`relative overflow-hidden transition-all hover:shadow-lg ${pkg.popular ? "border-accent shadow-md ring-1 ring-accent/20" : "border hover:border-accent/40"}`}>
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {t("POPULAR", "জনপ্রিয়")}
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                  <div className="my-3"><span className="text-3xl font-bold text-foreground">{pkg.speed}</span></div>
                  <div className="mb-4 p-3 rounded-lg bg-accent/8">
                    <span className="text-2xl font-bold text-accent">৳{pkg.price}</span>
                    <span className="text-muted-foreground text-sm">/{t("month", "মাস")}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/packages">
                    <Button variant={pkg.popular ? "default" : "outline"} className={`w-full font-semibold ${pkg.popular ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}`}>
                      {t("View Details", "বিস্তারিত")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/packages">
              <Button size="lg" variant="outline" className="font-semibold">
                {t("See All Plans", "সব প্ল্যান দেখুন")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Coverage CTA */}
      <section className="py-14 bg-secondary/50">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("Check If We're In Your Area", "আপনার এলাকায় আমরা আছি কিনা দেখুন")}</h2>
          <div className="flex gap-3 mt-6">
            <Input placeholder={t("Enter your area...", "এলাকার নাম...")} value={coverageCheck} onChange={(e) => setCoverageCheck(e.target.value)} />
            <Link to={`/coverage?q=${encodeURIComponent(coverageCheck)}`}>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shrink-0">
                <Search className="h-4 w-4 mr-1" /> {t("Check", "চেক")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("Customer Reviews", "গ্রাহকদের মতামত")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t_item) => (
              <Card key={t_item.name} className="border hover:border-accent/40 transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t_item.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t_item.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent font-bold text-sm">{t_item.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{t_item.name}</p>
                      <p className="text-xs text-muted-foreground">{t_item.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8">
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

export default Index;
