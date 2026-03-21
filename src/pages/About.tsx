import { Users, Award, Wifi, Shield, Zap, HeadphonesIcon, Clock, Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const timeline = [
  { year: "2015", title: "Founded", titleBn: "প্রতিষ্ঠিত", desc: "Galaxy Net started with a vision to connect Bangladesh." },
  { year: "2017", title: "1000 Customers", titleBn: "১০০০ গ্রাহক", desc: "Reached our first milestone of 1,000 happy subscribers." },
  { year: "2019", title: "Fiber Optic Upgrade", titleBn: "ফাইবার অপটিক আপগ্রেড", desc: "Migrated entire network to fiber optic infrastructure." },
  { year: "2021", title: "Citywide Expansion", titleBn: "শহরব্যাপী সম্প্রসারণ", desc: "Expanded coverage to 50+ areas across multiple cities." },
  { year: "2024", title: "10K+ Customers", titleBn: "১০,০০০+ গ্রাহক", desc: "Proudly serving over 10,000 homes and businesses." },
];

const team = [
  { name: "Md. Rafiq Hasan", nameBn: "মো. রফিক হাসান", role: "CEO & Founder", roleBn: "প্রতিষ্ঠাতা ও সিইও" },
  { name: "Nusrat Jahan", nameBn: "নুসরাত জাহান", role: "Operations Manager", roleBn: "অপারেশন ম্যানেজার" },
  { name: "Tanvir Ahmed", nameBn: "তানভীর আহমেদ", role: "Network Engineer", roleBn: "নেটওয়ার্ক ইঞ্জিনিয়ার" },
  { name: "Sabrina Akter", nameBn: "সাবরিনা আক্তার", role: "Customer Support Lead", roleBn: "গ্রাহক সেবা প্রধান" },
];

const stats = [
  { num: "10,000+", label: "Happy Customers", labelBn: "সন্তুষ্ট গ্রাহক", icon: Users },
  { num: "99.9%", label: "Uptime", labelBn: "আপটাইম", icon: Shield },
  { num: "50+", label: "Coverage Areas", labelBn: "কভারেজ এলাকা", icon: Wifi },
  { num: "24/7", label: "Support", labelBn: "সাপোর্ট", icon: HeadphonesIcon },
];

const trustBadges = [
  { icon: Server, label: "BDIX Connected", labelBn: "BDIX সংযুক্ত" },
  { icon: Zap, label: "Fiber Optic", labelBn: "ফাইবার অপটিক" },
  { icon: Shield, label: "99.9% Uptime", labelBn: "৯৯.৯% আপটাইম" },
  { icon: Clock, label: "Since 2015", labelBn: "২০১৫ থেকে" },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">About Galaxy Net</h1>
          <p className="text-2xl font-semibold text-orange-300 mb-4">গ্যালাক্সি নেট সম্পর্কে</p>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Connecting Bangladesh with fast, reliable, and affordable internet since 2015.
          </p>
          <p className="text-blue-300 text-sm mt-2">২০১৫ সাল থেকে বাংলাদেশকে দ্রুত ও নির্ভরযোগ্য ইন্টারনেটে সংযুক্ত করছি।</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" className="fill-background w-full h-12 md:h-16">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="border-2 hover:border-galaxy-orange transition-all">
                <CardContent className="p-6 text-center">
                  <s.icon className="h-8 w-8 text-galaxy-orange mx-auto mb-3" />
                  <div className="text-3xl font-bold text-galaxy-blue">{s.num}</div>
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.labelBn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {trustBadges.map((b) => (
              <Badge key={b.label} className="flex items-center gap-2 px-4 py-2 text-sm bg-galaxy-blue text-white border-0">
                <b.icon className="h-4 w-4" />
                {b.label} · {b.labelBn}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-galaxy-blue mb-2">Our Journey</h2>
            <p className="text-xl font-semibold text-galaxy-orange">আমাদের পথচলা</p>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            Galaxy Net was founded in 2015 with a simple mission — to provide fast, reliable, and affordable internet to every household and business in Bangladesh. What started as a small local ISP has grown into a trusted provider serving over 10,000 customers across 50+ areas.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-12">
            গ্যালাক্সি নেট ২০১৫ সালে একটি সাধারণ লক্ষ্য নিয়ে প্রতিষ্ঠিত হয়েছিল — বাংলাদেশের প্রতিটি ঘর ও ব্যবসায় দ্রুত, নির্ভরযোগ্য এবং সাশ্রয়ী ইন্টারনেট সেবা দেওয়া। আজ আমরা ৫০+ এলাকায় ১০,০০০+ গ্রাহকদের সেবা দিচ্ছি।
          </p>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-galaxy-orange/30" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={item.year} className={`relative flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-galaxy-orange flex items-center justify-center z-10">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div className={`ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <Badge className="bg-galaxy-orange text-white border-0 mb-2">{item.year}</Badge>
                    <h3 className="font-bold text-galaxy-blue text-lg">{item.title}</h3>
                    <p className="text-galaxy-orange text-sm font-medium">{item.titleBn}</p>
                    <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-galaxy-blue mb-2">Our Team</h2>
            <p className="text-xl font-semibold text-galaxy-orange">আমাদের দল</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map((t) => (
              <Card key={t.name} className="border-2 hover:border-galaxy-orange transition-all">
                <CardContent className="p-6 text-center">
                  <div className="h-20 w-20 rounded-full bg-galaxy-orange/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-galaxy-orange" />
                  </div>
                  <h3 className="font-bold text-galaxy-blue">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.nameBn}</p>
                  <p className="text-sm text-galaxy-orange font-medium mt-1">{t.role}</p>
                  <p className="text-xs text-muted-foreground">{t.roleBn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-galaxy-blue mb-2">Why Choose Galaxy Net?</h2>
          <p className="text-xl font-semibold text-galaxy-orange mb-8">কেন গ্যালাক্সি নেট বেছে নেবেন?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Zap, title: "Blazing Speed", titleBn: "অসাধারণ গতি", desc: "Fiber optic network delivers speeds up to 1 Gbps with BDIX connectivity." },
              { icon: Shield, title: "Rock-Solid Reliability", titleBn: "দৃঢ় নির্ভরযোগ্যতা", desc: "99.9% uptime guarantee backed by redundant infrastructure." },
              { icon: HeadphonesIcon, title: "Local Support", titleBn: "স্থানীয় সাপোর্ট", desc: "24/7 Bangla & English support from our expert team." },
            ].map((item) => (
              <Card key={item.title} className="border-2 hover:border-galaxy-orange transition-all">
                <CardContent className="p-6">
                  <item.icon className="h-10 w-10 text-galaxy-orange mx-auto mb-4" />
                  <h3 className="font-bold text-galaxy-blue text-lg">{item.title}</h3>
                  <p className="text-galaxy-orange text-sm font-medium mb-2">{item.titleBn}</p>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
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
