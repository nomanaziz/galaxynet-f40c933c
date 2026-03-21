import { Users, Award, Wifi, Shield, Zap, HeadphonesIcon, Clock, Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  const timeline = [
    { year: "2015", title: t("Founded", "প্রতিষ্ঠিত"), desc: t("Galaxy Net started with a vision to connect Bangladesh.", "গ্যালাক্সি নেট বাংলাদেশকে সংযুক্ত করার লক্ষ্যে যাত্রা শুরু করে।") },
    { year: "2017", title: t("1000 Customers", "১০০০ গ্রাহক"), desc: t("Reached our first milestone.", "প্রথম মাইলফলকে পৌঁছেছি।") },
    { year: "2019", title: t("Fiber Optic Upgrade", "ফাইবার অপটিক আপগ্রেড"), desc: t("Migrated entire network to fiber optic.", "সম্পূর্ণ নেটওয়ার্ক ফাইবার অপটিকে স্থানান্তর।") },
    { year: "2021", title: t("Citywide Expansion", "শহরব্যাপী সম্প্রসারণ"), desc: t("Expanded to 50+ areas.", "৫০+ এলাকায় সম্প্রসারণ।") },
    { year: "2024", title: t("10K+ Customers", "১০,০০০+ গ্রাহক"), desc: t("Serving over 10,000 homes and businesses.", "১০,০০০+ ঘর ও ব্যবসায় সেবা প্রদান।") },
  ];

  const team = [
    { name: t("Md. Rafiq Hasan", "মো. রফিক হাসান"), role: t("CEO & Founder", "প্রতিষ্ঠাতা ও সিইও") },
    { name: t("Nusrat Jahan", "নুসরাত জাহান"), role: t("Operations Manager", "অপারেশন ম্যানেজার") },
    { name: t("Tanvir Ahmed", "তানভীর আহমেদ"), role: t("Network Engineer", "নেটওয়ার্ক ইঞ্জিনিয়ার") },
    { name: t("Sabrina Akter", "সাবরিনা আক্তার"), role: t("Customer Support Lead", "গ্রাহক সেবা প্রধান") },
  ];

  const stats = [
    { num: "10,000+", label: t("Happy Customers", "সন্তুষ্ট গ্রাহক"), icon: Users },
    { num: "99.9%", label: t("Uptime", "আপটাইম"), icon: Shield },
    { num: "50+", label: t("Coverage Areas", "কভারেজ এলাকা"), icon: Wifi },
    { num: "24/7", label: t("Support", "সাপোর্ট"), icon: HeadphonesIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="page-hero">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{t("About Galaxy Net", "গ্যালাক্সি নেট সম্পর্কে")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("Connecting Bangladesh with fast, reliable internet since 2015.", "২০১৫ সাল থেকে দ্রুত ও নির্ভরযোগ্য ইন্টারনেটে সংযুক্ত করছি।")}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="border hover:border-accent/40 transition-all">
                <CardContent className="p-6 text-center">
                  <s.icon className="h-7 w-7 text-accent mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">{s.num}</div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Server, label: t("BDIX Connected", "BDIX সংযুক্ত") },
              { icon: Zap, label: t("Fiber Optic", "ফাইবার অপটিক") },
              { icon: Shield, label: t("99.9% Uptime", "৯৯.৯% আপটাইম") },
              { icon: Clock, label: t("Since 2015", "২০১৫ থেকে") },
            ].map((b) => (
              <Badge key={b.label} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground border-0">
                <b.icon className="h-4 w-4" /> {b.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">{t("Our Journey", "আমাদের পথচলা")}</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            {t("From a small local ISP to serving 10,000+ customers across Bangladesh.", "একটি ছোট স্থানীয় ISP থেকে বাংলাদেশজুড়ে ১০,০০০+ গ্রাহকে সেবা প্রদান।")}
          </p>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={item.year} className={`relative flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-accent flex items-center justify-center z-10">
                    <Award className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className={`ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <Badge className="bg-accent text-accent-foreground border-0 mb-2">{item.year}</Badge>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">{t("Our Team", "আমাদের দল")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {team.map((member) => (
              <Card key={member.name} className="border hover:border-accent/40 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-accent font-medium mt-1">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
