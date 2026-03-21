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

const homePlans = [
  { name: "Home Basic", nameBn: "হোম বেসিক", speed: 10, price: "500", tag: "", features: ["Unlimited Data", "Email Support", "1 Device", "Standard Router"], badges: ["BDIX"] },
  { name: "Home Standard", nameBn: "হোম স্ট্যান্ডার্ড", speed: 50, price: "900", tag: "Most Popular · সবচেয়ে জনপ্রিয়", features: ["Unlimited Data", "24/7 Support", "5 Devices", "Free Router", "Free Installation"], badges: ["BDIX", "FTP"] },
  { name: "Home Premium", nameBn: "হোম প্রিমিয়াম", speed: 100, price: "1500", tag: "", features: ["Unlimited Data", "Priority 24/7 Support", "Unlimited Devices", "Free Router + Setup", "Static IP Available"], badges: ["BDIX", "FTP", "Cache"] },
  { name: "Home Ultra", nameBn: "হোম আলট্রা", speed: 200, price: "2500", tag: "Best Value", features: ["Unlimited Data", "VIP Support", "Unlimited Devices", "Premium Router + Setup", "Static IP", "1 Month Free"], badges: ["BDIX", "FTP", "Cache"] },
];

const businessPlans = [
  { name: "Business Starter", nameBn: "বিজনেস স্টার্টার", speed: 100, price: "3000", tag: "", features: ["Unlimited Data", "Business Support 9–9", "5 Users", "Free Router", "SLA 99.5%"], badges: ["BDIX", "FTP"] },
  { name: "Business Pro", nameBn: "বিজনেস প্রো", speed: 300, price: "6000", tag: "Recommended · প্রস্তাবিত", features: ["Unlimited Data", "24/7 Priority Support", "20 Users", "Enterprise Router", "SLA 99.9%", "Static IP"], badges: ["BDIX", "FTP", "Cache"] },
  { name: "Business Enterprise", nameBn: "বিজনেস এন্টারপ্রাইজ", speed: 1000, price: "12000", tag: "", features: ["Unlimited Data", "Dedicated Account Manager", "Unlimited Users", "Enterprise-grade Router", "SLA 99.99%", "Multiple Static IPs", "Dedicated Line"], badges: ["BDIX", "FTP", "Cache", "Dedicated"] },
];

const badgeIcons: Record<string, typeof Server> = { BDIX: Server, FTP: Globe, Cache: MonitorPlay, Dedicated: Zap };

const PlanCard = ({ plan }: { plan: typeof homePlans[0] }) => {
  const isPopular = !!plan.tag;
  return (
    <Card className={`relative overflow-hidden border-2 transition-all hover:shadow-xl ${isPopular ? "border-galaxy-orange shadow-lg" : "border-border hover:border-galaxy-orange"}`}>
      {plan.tag && (
        <div className="absolute top-0 right-0 bg-galaxy-orange text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
          {plan.tag}
        </div>
      )}
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-galaxy-blue">{plan.name}</h3>
          <p className="text-galaxy-orange text-sm font-medium">{plan.nameBn}</p>
        </div>
        <div className="flex items-end gap-1 mb-2">
          <Zap className="h-5 w-5 text-galaxy-orange mb-1" />
          <span className="text-3xl font-bold text-galaxy-blue">{plan.speed >= 1000 ? `${plan.speed / 1000} Gbps` : `${plan.speed} Mbps`}</span>
        </div>
        <div className="mb-3 p-3 rounded-lg bg-galaxy-orange/10">
          <span className="text-3xl font-bold text-galaxy-orange">৳{plan.price}</span>
          <span className="text-muted-foreground text-sm">/month · /মাস</span>
        </div>
        {/* Badges */}
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
            <li key={f} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-galaxy-orange shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
        <Link to="/order">
          <Button className={`w-full font-semibold ${isPopular ? "bg-galaxy-orange hover:bg-galaxy-orange-dark text-white" : "bg-galaxy-blue hover:bg-galaxy-blue-dark text-white"}`}>
            Order Now · অর্ডার করুন
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const Packages = () => {
  const [speedFilter, setSpeedFilter] = useState([0]);

  const filterPlans = (plans: typeof homePlans) => {
    const min = speedFilter[0];
    if (min === 0) return plans;
    return plans.filter((p) => p.speed >= min);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Internet Packages</h1>
          <p className="text-2xl font-semibold text-orange-300 mb-4">ইন্টারনেট প্যাকেজসমূহ</p>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Choose the perfect plan for your home or business. All plans include unlimited data!
          </p>
          <p className="text-blue-300 text-sm mt-2 max-w-xl mx-auto">
            আপনার ঘর বা ব্যবসার জন্য সেরা প্ল্যান বেছে নিন। সব প্ল্যানে আনলিমিটেড ডেটা!
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" className="fill-background w-full h-12 md:h-16">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 md:py-20 bg-background flex-1">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="home" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="h-12 p-1 bg-secondary border-2 border-galaxy-blue/20">
                <TabsTrigger value="home" className="px-6 py-2 text-sm font-semibold data-[state=active]:bg-galaxy-blue data-[state=active]:text-white">
                  🏠 Home Plans · হোম প্ল্যান
                </TabsTrigger>
                <TabsTrigger value="business" className="px-6 py-2 text-sm font-semibold data-[state=active]:bg-galaxy-blue data-[state=active]:text-white">
                  🏢 Business Plans · বিজনেস প্ল্যান
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Speed Filter */}
            <div className="max-w-md mx-auto mb-10 p-4 rounded-xl bg-secondary border-2 border-border">
              <p className="text-sm font-semibold text-galaxy-blue mb-2 text-center">
                Filter by Speed · গতি অনুযায়ী ফিল্টার: {speedFilter[0] === 0 ? "All" : `${speedFilter[0]}+ Mbps`}
              </p>
              <Slider value={speedFilter} onValueChange={setSpeedFilter} max={200} step={10} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>All</span>
                <span>50 Mbps</span>
                <span>100 Mbps</span>
                <span>200+ Mbps</span>
              </div>
            </div>

            <TabsContent value="home">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filterPlans(homePlans).map((plan) => (
                  <PlanCard key={plan.name} plan={plan} />
                ))}
              </div>
              {filterPlans(homePlans).length === 0 && (
                <p className="text-center text-muted-foreground py-8">No plans match this speed range. · এই গতির কোনো প্ল্যান নেই।</p>
              )}
            </TabsContent>

            <TabsContent value="business">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {filterPlans(businessPlans).map((plan) => (
                  <PlanCard key={plan.name} plan={plan} />
                ))}
              </div>
              {filterPlans(businessPlans).length === 0 && (
                <p className="text-center text-muted-foreground py-8">No plans match this speed range. · এই গতির কোনো প্ল্যান নেই।</p>
              )}
            </TabsContent>
          </Tabs>

          {/* Note */}
          <div className="mt-12 p-6 rounded-xl bg-secondary border-2 border-galaxy-blue/20 text-center">
            <p className="text-galaxy-blue font-semibold">📞 Need a custom plan? · কাস্টম প্ল্যান দরকার?</p>
            <p className="text-muted-foreground text-sm mt-1">Call us at +880 1700-000000 or contact us online.</p>
            <p className="text-muted-foreground text-sm">+880 1700-000000 নম্বরে কল করুন বা অনলাইনে যোগাযোগ করুন।</p>
            <Link to="/contact" className="inline-block mt-4">
              <Button className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-semibold">
                Contact Us · যোগাযোগ করুন
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
