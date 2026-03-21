import { Link } from "react-router-dom";
import { Zap, Shield, HeadphonesIcon, DollarSign, Star, CheckCircle, ArrowRight, Wifi, Server, Globe, Gamepad2, Building2, Camera, Network, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const trustStats = [
  { num: "99.9%", label: "Uptime", labelBn: "আপটাইম", icon: Shield },
  { num: "10K+", label: "Clients", labelBn: "গ্রাহক", icon: Wifi },
  { num: "50+", label: "Areas", labelBn: "এলাকা", icon: MapPin },
  { num: "BDIX", label: "Connected", labelBn: "সংযুক্ত", icon: Server },
];

const features = [
  { icon: Zap, title: "High Speed Fiber", titleBn: "উচ্চ গতির ফাইবার", desc: "Up to 1 Gbps fiber optic broadband", descBn: "১ Gbps পর্যন্ত ফাইবার অপটিক" },
  { icon: Shield, title: "Unlimited Data", titleBn: "আনলিমিটেড ডেটা", desc: "No data caps on any plan", descBn: "কোনো ডেটা সীমা নেই" },
  { icon: HeadphonesIcon, title: "24/7 Support", titleBn: "২৪/৭ সাপোর্ট", desc: "Expert help whenever you need", descBn: "যেকোনো সময় বিশেষজ্ঞ সহায়তা" },
  { icon: DollarSign, title: "Affordable Plans", titleBn: "সাশ্রয়ী প্ল্যান", desc: "Best value for your budget", descBn: "আপনার বাজেটের জন্য সেরা" },
  { icon: Globe, title: "BDIX + FTP", titleBn: "BDIX + FTP", desc: "Local content at maximum speed", descBn: "স্থানীয় কন্টেন্ট সর্বোচ্চ গতিতে" },
  { icon: Gamepad2, title: "Low Latency", titleBn: "কম লেটেন্সি", desc: "Optimized for gaming & streaming", descBn: "গেমিং ও স্ট্রিমিংয়ের জন্য অপ্টিমাইজড" },
];

const servicesPreview = [
  { icon: Wifi, title: "Broadband", titleBn: "ব্রডব্যান্ড" },
  { icon: Building2, title: "Corporate", titleBn: "কর্পোরেট" },
  { icon: Camera, title: "CCTV", titleBn: "সিসিটিভি" },
  { icon: Network, title: "Networking", titleBn: "নেটওয়ার্কিং" },
  { icon: Server, title: "Dedicated", titleBn: "ডেডিকেটেড" },
];

const packages = [
  { name: "Basic", nameBn: "বেসিক", speed: "10 Mbps", price: "500", features: ["Unlimited Data", "BDIX", "Email Support"], badges: [] },
  { name: "Standard", nameBn: "স্ট্যান্ডার্ড", speed: "50 Mbps", price: "900", popular: true, features: ["Unlimited Data", "BDIX + FTP", "24/7 Support", "Free Router"], badges: ["BDIX", "FTP"] },
  { name: "Premium", nameBn: "প্রিমিয়াম", speed: "100 Mbps", price: "1500", features: ["Unlimited Data", "BDIX + FTP", "Priority Support", "Free Router + Setup"], badges: ["BDIX", "FTP", "Cache"] },
];

const testimonials = [
  { name: "Rahim Uddin", nameBn: "রহিম উদ্দিন", location: "Dhaka", rating: 5, text: "Galaxy Net has transformed my home internet. Super fast and never drops!", textBn: "গ্যালাক্সি নেট আমার হোম ইন্টারনেট বদলে দিয়েছে।" },
  { name: "Fatema Khanam", nameBn: "ফাতেমা খানম", location: "Chittagong", rating: 5, text: "Affordable pricing with excellent customer service. Highly recommended!", textBn: "সাশ্রয়ী মূল্যে চমৎকার গ্রাহক সেবা।" },
  { name: "Karim Ahmed", nameBn: "করিম আহমেদ", location: "Sylhet", rating: 5, text: "Best ISP in our area. 24/7 support team is always ready to help.", textBn: "আমাদের এলাকার সেরা ISP।" },
];

const Index = () => {
  const [coverageCheck, setCoverageCheck] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-galaxy-orange blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-galaxy-orange">
                <Wifi className="h-4 w-4 text-white" />
              </div>
              <span className="text-orange-300 font-semibold text-sm uppercase tracking-widest">Galaxy Net · গ্যালাক্সি নেট</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              Best Internet in{" "}
              <span className="text-galaxy-orange">Your Area</span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-blue-100 mb-2">আপনার এলাকায় সেরা ইন্টারনেট</p>
            <p className="text-blue-200 text-lg mt-4 mb-4 max-w-xl">
              Bangladesh's trusted ISP — connecting families and businesses with lightning-fast fiber broadband.
            </p>
            {/* BDIX/FTP/Gaming badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["⚡ BDIX Connected", "📁 FTP Server", "🎮 Low Latency", "📺 YouTube/FB Cache"].map((b) => (
                <Badge key={b} className="bg-white/15 text-white border-white/30 text-xs">{b}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/coverage">
                <Button size="lg" className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-bold px-8 py-6 text-lg shadow-lg">
                  Check Coverage · কভারেজ চেক
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/order">
                <Button size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white/20 font-bold px-8 py-6 text-lg">
                  Get Connection · সংযোগ নিন
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" className="fill-background w-full h-12 md:h-16">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustStats.map((s) => (
              <div key={s.label} className="flex items-center justify-center gap-3 p-3">
                <s.icon className="h-7 w-7 text-galaxy-orange shrink-0" />
                <div>
                  <div className="text-xl font-bold text-galaxy-blue">{s.num}</div>
                  <div className="text-xs text-muted-foreground">{s.label} · {s.labelBn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-galaxy-blue mb-2">Why Choose Galaxy Net?</h2>
            <p className="text-xl font-semibold text-galaxy-orange">কেন গ্যালাক্সি নেট বেছে নেবেন?</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-2 hover:border-galaxy-orange transition-all hover:shadow-lg group">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-14 w-14 rounded-full bg-galaxy-orange/10 flex items-center justify-center group-hover:bg-galaxy-orange transition-colors">
                      <f.icon className="h-7 w-7 text-galaxy-orange group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <h3 className="font-bold text-galaxy-blue text-lg">{f.title}</h3>
                  <p className="text-galaxy-orange font-medium text-sm mb-2">{f.titleBn}</p>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                  <p className="text-muted-foreground text-xs mt-1">{f.descBn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-galaxy-blue mb-2">Our Services</h2>
            <p className="text-xl font-semibold text-galaxy-orange">আমাদের সেবাসমূহ</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {servicesPreview.map((s) => (
              <div key={s.title} className="flex flex-col items-center p-5 rounded-xl bg-background border-2 border-border hover:border-galaxy-orange transition-all min-w-[120px]">
                <s.icon className="h-8 w-8 text-galaxy-orange mb-2" />
                <p className="font-semibold text-galaxy-blue text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.titleBn}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/services">
              <Button variant="outline" className="border-2 border-galaxy-blue text-galaxy-blue hover:bg-galaxy-blue hover:text-white font-semibold">
                All Services · সব সেবা <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Packages */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-galaxy-blue mb-2">Popular Packages</h2>
            <p className="text-xl font-semibold text-galaxy-orange">জনপ্রিয় প্যাকেজসমূহ</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.name} className={`relative overflow-hidden border-2 transition-all hover:shadow-xl ${pkg.popular ? "border-galaxy-orange shadow-lg scale-105" : "border-border hover:border-galaxy-orange"}`}>
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-galaxy-orange text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    POPULAR · জনপ্রিয়
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-galaxy-blue">{pkg.name}</h3>
                  <p className="text-galaxy-orange font-medium">{pkg.nameBn}</p>
                  <div className="my-4"><span className="text-4xl font-bold text-galaxy-blue">{pkg.speed}</span></div>
                  <div className="mb-4 p-3 rounded-lg bg-galaxy-orange/10">
                    <span className="text-3xl font-bold text-galaxy-orange">৳{pkg.price}</span>
                    <span className="text-muted-foreground text-sm">/month · মাস</span>
                  </div>
                  {pkg.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pkg.badges.map((b) => (
                        <Badge key={b} className="bg-galaxy-blue/10 text-galaxy-blue border-0 text-xs">{b}</Badge>
                      ))}
                    </div>
                  )}
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-galaxy-orange shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/order">
                    <Button className={`w-full font-semibold ${pkg.popular ? "bg-galaxy-orange hover:bg-galaxy-orange-dark text-white" : "bg-galaxy-blue hover:bg-galaxy-blue-dark text-white"}`}>
                      Order Now · অর্ডার করুন
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/packages">
              <Button size="lg" variant="outline" className="border-2 border-galaxy-blue text-galaxy-blue hover:bg-galaxy-blue hover:text-white font-semibold">
                See All Plans · সব প্ল্যান দেখুন <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Coverage CTA */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <MapPin className="h-10 w-10 text-galaxy-orange mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-galaxy-blue mb-1">Check If We're In Your Area</h2>
          <p className="text-galaxy-orange font-medium mb-6">আপনার এলাকায় আমরা আছি কিনা দেখুন</p>
          <div className="flex gap-3">
            <Input placeholder="Enter your area... · এলাকার নাম..." value={coverageCheck} onChange={(e) => setCoverageCheck(e.target.value)} className="border-2 border-galaxy-blue/20" />
            <Link to={`/coverage?q=${encodeURIComponent(coverageCheck)}`}>
              <Button className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-semibold shrink-0">
                <Search className="h-4 w-4 mr-1" /> Check
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-galaxy-blue mb-2">Customer Reviews</h2>
            <p className="text-xl font-semibold text-galaxy-orange">গ্রাহকদের মতামত</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-2 hover:border-galaxy-orange transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-galaxy-orange text-galaxy-orange" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-2">"{t.text}"</p>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">"{t.textBn}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-galaxy-orange/20 flex items-center justify-center">
                      <span className="text-galaxy-orange font-bold text-sm">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-galaxy-blue">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.nameBn} · {t.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Connected?</h2>
          <p className="text-2xl font-semibold text-orange-300 mb-4">সংযুক্ত হতে প্রস্তুত?</p>
          <p className="text-blue-200 text-lg mb-8">Join thousands of happy customers today!</p>
          <Link to="/order">
            <Button size="lg" className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-bold px-10 py-6 text-lg shadow-xl">
              Order Now · এখনই অর্ডার করুন <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
