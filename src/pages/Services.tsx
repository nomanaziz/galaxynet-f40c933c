import { Link } from "react-router-dom";
import { Wifi, Building2, Server, Camera, Network, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    icon: Wifi,
    title: "Broadband Internet",
    titleBn: "ব্রডব্যান্ড ইন্টারনেট",
    desc: "High-speed fiber optic broadband for homes. Enjoy unlimited data, BDIX connectivity, and low latency for streaming, gaming, and browsing.",
    descBn: "বাড়ির জন্য উচ্চ গতির ফাইবার অপটিক ব্রডব্যান্ড। আনলিমিটেড ডেটা, BDIX সংযোগ এবং স্ট্রিমিং, গেমিং ও ব্রাউজিংয়ের জন্য কম লেটেন্সি।",
    features: ["Up to 200 Mbps", "BDIX + FTP", "Unlimited Data", "Free Router"],
    link: "/packages",
    badge: "Most Popular",
  },
  {
    icon: Building2,
    title: "Corporate Internet",
    titleBn: "কর্পোরেট ইন্টারনেট",
    desc: "Dedicated bandwidth for businesses with guaranteed uptime SLA, static IP, and priority support for seamless operations.",
    descBn: "ব্যবসার জন্য ডেডিকেটেড ব্যান্ডউইথ, গ্যারান্টিড আপটাইম SLA, স্ট্যাটিক IP এবং অগ্রাধিকার সাপোর্ট।",
    features: ["Dedicated Line", "99.99% SLA", "Static IP", "24/7 Support"],
    link: "/packages",
    badge: "",
  },
  {
    icon: Server,
    title: "Dedicated Bandwidth",
    titleBn: "ডেডিকেটেড ব্যান্ডউইথ",
    desc: "Enterprise-grade dedicated bandwidth solutions for ISPs, data centers, and large organizations requiring unshared connectivity.",
    descBn: "ISP, ডেটা সেন্টার এবং বড় প্রতিষ্ঠানের জন্য এন্টারপ্রাইজ-গ্রেড ডেডিকেটেড ব্যান্ডউইথ সলিউশন।",
    features: ["1:1 Bandwidth", "Redundant Links", "Custom SLA", "Account Manager"],
    link: "/contact",
    badge: "Enterprise",
  },
  {
    icon: Camera,
    title: "CCTV Solution",
    titleBn: "সিসিটিভি সমাধান",
    desc: "Complete surveillance solutions including IP camera installation, NVR setup, remote monitoring, and cloud storage for homes and businesses.",
    descBn: "IP ক্যামেরা ইনস্টলেশন, NVR সেটআপ, রিমোট মনিটরিং এবং ক্লাউড স্টোরেজ সহ সম্পূর্ণ নজরদারি সমাধান।",
    features: ["IP Cameras", "NVR Setup", "Remote Access", "Cloud Storage"],
    link: "/contact",
    badge: "",
  },
  {
    icon: Network,
    title: "Network Setup",
    titleBn: "নেটওয়ার্ক সেটআপ",
    desc: "Professional network infrastructure setup for offices, buildings, and enterprises including cabling, WiFi, and firewall configuration.",
    descBn: "অফিস, বিল্ডিং এবং এন্টারপ্রাইজের জন্য পেশাদার নেটওয়ার্ক ইনফ্রাস্ট্রাকচার সেটআপ।",
    features: ["Structured Cabling", "WiFi Setup", "Firewall Config", "Maintenance"],
    link: "/contact",
    badge: "",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Services</h1>
          <p className="text-2xl font-semibold text-orange-300 mb-4">আমাদের সেবাসমূহ</p>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            From broadband internet to enterprise networking — Galaxy Net provides complete connectivity solutions.
          </p>
          <p className="text-blue-300 text-sm mt-2">ব্রডব্যান্ড ইন্টারনেট থেকে এন্টারপ্রাইজ নেটওয়ার্কিং — সম্পূর্ণ সংযোগ সমাধান।</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" className="fill-background w-full h-12 md:h-16">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Zap, label: "99.9% Uptime" },
              { icon: Globe, label: "BDIX Connected" },
              { icon: Shield, label: "Secure Network" },
              { icon: Server, label: "FTP Server" },
            ].map((h) => (
              <div key={h.label} className="flex items-center gap-2 text-sm font-semibold text-galaxy-blue">
                <h.icon className="h-5 w-5 text-galaxy-orange" />
                {h.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s) => (
              <Card key={s.title} className="relative border-2 hover:border-galaxy-orange transition-all hover:shadow-xl group">
                {s.badge && (
                  <div className="absolute top-0 right-0 bg-galaxy-orange text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {s.badge}
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-xl bg-galaxy-orange/10 flex items-center justify-center mb-4 group-hover:bg-galaxy-orange transition-colors">
                    <s.icon className="h-7 w-7 text-galaxy-orange group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-galaxy-blue">{s.title}</h3>
                  <p className="text-galaxy-orange font-medium text-sm mb-3">{s.titleBn}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-2">{s.desc}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">{s.descBn}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {s.features.map((f) => (
                      <Badge key={f} variant="secondary" className="text-xs font-medium">
                        {f}
                      </Badge>
                    ))}
                  </div>
                  <Link to={s.link}>
                    <Button className="w-full bg-galaxy-blue hover:bg-galaxy-blue-dark text-white font-semibold">
                      Learn More · বিস্তারিত
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Need a Custom Solution?</h2>
          <p className="text-xl font-semibold text-orange-300 mb-4">কাস্টম সমাধান দরকার?</p>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            Our team can design a tailored connectivity solution for your business needs.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-bold px-10 py-6 text-lg">
              Contact Us · যোগাযোগ করুন
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
