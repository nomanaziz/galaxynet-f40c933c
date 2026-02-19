import { Link } from "react-router-dom";
import { Zap, Shield, HeadphonesIcon, DollarSign, Star, CheckCircle, ArrowRight, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Zap,
    title: "High Speed",
    titleBn: "উচ্চ গতি",
    desc: "Blazing fast internet up to 1 Gbps",
    descBn: "১ Gbps পর্যন্ত দ্রুত ইন্টারনেট",
  },
  {
    icon: Shield,
    title: "Unlimited Data",
    titleBn: "আনলিমিটেড ডেটা",
    desc: "No data caps, browse freely",
    descBn: "কোনো ডেটা সীমা নেই, মুক্তভাবে ব্রাউজ করুন",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    titleBn: "২৪/৭ সাপোর্ট",
    desc: "Expert help whenever you need it",
    descBn: "যখনই দরকার, বিশেষজ্ঞ সহায়তা",
  },
  {
    icon: DollarSign,
    title: "Affordable",
    titleBn: "সাশ্রয়ী মূল্য",
    desc: "Best plans that fit any budget",
    descBn: "যেকোনো বাজেটের জন্য সেরা প্ল্যান",
  },
];

const packages = [
  {
    name: "Basic",
    nameBn: "বেসিক",
    speed: "10 Mbps",
    price: "500",
    features: ["Unlimited Data", "Email Support", "1 Device"],
  },
  {
    name: "Standard",
    nameBn: "স্ট্যান্ডার্ড",
    speed: "50 Mbps",
    price: "900",
    popular: true,
    features: ["Unlimited Data", "24/7 Support", "5 Devices", "Free Router"],
  },
  {
    name: "Premium",
    nameBn: "প্রিমিয়াম",
    speed: "100 Mbps",
    price: "1500",
    features: ["Unlimited Data", "Priority Support", "Unlimited Devices", "Free Router + Installation"],
  },
];

const testimonials = [
  {
    name: "Rahim Uddin",
    nameBn: "রহিম উদ্দিন",
    location: "Dhaka",
    rating: 5,
    text: "Galaxy Net has transformed my home internet. Super fast and never drops!",
    textBn: "গ্যালাক্সি নেট আমার হোম ইন্টারনেট বদলে দিয়েছে। অনেক দ্রুত এবং কখনো বিচ্ছিন্ন হয় না!",
  },
  {
    name: "Fatema Khanam",
    nameBn: "ফাতেমা খানম",
    location: "Chittagong",
    rating: 5,
    text: "Affordable pricing with excellent customer service. Highly recommended!",
    textBn: "সাশ্রয়ী মূল্যে চমৎকার গ্রাহক সেবা। সবাইকে সুপারিশ করছি!",
  },
  {
    name: "Karim Ahmed",
    nameBn: "করিম আহমেদ",
    location: "Sylhet",
    rating: 5,
    text: "Best ISP in our area. 24/7 support team is always ready to help.",
    textBn: "আমাদের এলাকার সেরা ISP। ২৪/৭ সাপোর্ট টিম সবসময় সাহায্য করতে প্রস্তুত।",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-galaxy-orange blur-3xl"></div>
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
              Fast. Reliable.{" "}
              <span className="text-galaxy-orange">Affordable.</span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-blue-100 mb-2">
              দ্রুত। নির্ভরযোগ্য। সাশ্রয়ী।
            </p>
            <p className="text-blue-200 text-lg mt-4 mb-8 max-w-xl">
              Bangladesh's most trusted internet service provider — connecting families and businesses with lightning-fast broadband.
            </p>
            <p className="text-blue-300 text-base mb-8">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত ইন্টারনেট সেবা প্রদানকারী।
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-bold px-8 py-6 text-lg shadow-lg">
                  Get Connected · সংযুক্ত হন
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/packages">
                <Button size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white/20 font-bold px-8 py-6 text-lg">
                  See Plans · প্ল্যান দেখুন
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" className="fill-background w-full h-12 md:h-16">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-galaxy-blue mb-2">
              Why Choose Galaxy Net?
            </h2>
            <p className="text-xl font-semibold text-galaxy-orange">কেন গ্যালাক্সি নেট বেছে নেবেন?</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Popular Packages Teaser */}
      <section className="py-16 md:py-20 bg-secondary">
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
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-galaxy-blue">{pkg.name}</h3>
                    <p className="text-galaxy-orange font-medium">{pkg.nameBn}</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-galaxy-blue">{pkg.speed}</span>
                  </div>
                  <div className="mb-4 p-3 rounded-lg bg-galaxy-orange/10">
                    <span className="text-3xl font-bold text-galaxy-orange">৳{pkg.price}</span>
                    <span className="text-muted-foreground text-sm">/month · মাস</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-galaxy-orange shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact">
                    <Button className={`w-full font-semibold ${pkg.popular ? "bg-galaxy-orange hover:bg-galaxy-orange-dark text-white" : "bg-galaxy-blue hover:bg-galaxy-blue-dark text-white"}`}>
                      Subscribe Now · সাবস্ক্রাইব করুন
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/packages">
              <Button size="lg" variant="outline" className="border-2 border-galaxy-blue text-galaxy-blue hover:bg-galaxy-blue hover:text-white font-semibold">
                See All Plans · সব প্ল্যান দেখুন
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-galaxy-blue mb-2">About Galaxy Net</h2>
              <p className="text-xl font-semibold text-galaxy-orange mb-6">গ্যালাক্সি নেট সম্পর্কে</p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Galaxy Net is a leading internet service provider dedicated to delivering fast, reliable, and affordable broadband across Bangladesh. Since our founding, we've been committed to connecting communities and empowering people through technology.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                গ্যালাক্সি নেট বাংলাদেশের একটি শীর্ষস্থানীয় ইন্টারনেট সেবা প্রদানকারী। আমরা দ্রুত, নির্ভরযোগ্য এবং সাশ্রয়ী ব্রডব্যান্ড সংযোগ দেওয়ার প্রতিশ্রুতি নিয়ে কাজ করি।
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { num: "10K+", label: "Customers · গ্রাহক" },
                  { num: "50+", label: "Areas · এলাকা" },
                  { num: "99.9%", label: "Uptime" },
                ].map((stat) => (
                  <div key={stat.num} className="text-center p-4 rounded-lg bg-secondary">
                    <div className="text-2xl font-bold text-galaxy-orange">{stat.num}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link to="/coverage">
                <Button className="bg-galaxy-blue hover:bg-galaxy-blue-dark text-white font-semibold">
                  Learn More · আরও জানুন
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="hero-gradient rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Zap, label: "Fiber Optic", labelBn: "ফাইবার অপটিক" },
                    { icon: Shield, label: "Secure Network", labelBn: "নিরাপদ নেটওয়ার্ক" },
                    { icon: HeadphonesIcon, label: "Expert Team", labelBn: "বিশেষজ্ঞ দল" },
                    { icon: Wifi, label: "Wide Coverage", labelBn: "বিস্তৃত কভারেজ" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center text-center p-4 rounded-xl bg-white/10">
                      <item.icon className="h-8 w-8 text-galaxy-orange mb-2" />
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-blue-200">{item.labelBn}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-secondary">
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
          <Link to="/contact">
            <Button size="lg" className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-bold px-10 py-6 text-lg shadow-xl">
              Contact Us Now · এখনই যোগাযোগ করুন
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
