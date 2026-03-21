import { ExternalLink, Wifi, ArrowRight, Zap, Monitor, Router } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tips = [
  { icon: Router, title: "Use Wired Connection", titleBn: "তারযুক্ত সংযোগ ব্যবহার করুন", desc: "Connect via ethernet cable for most accurate results." },
  { icon: Monitor, title: "Close Other Apps", titleBn: "অন্যান্য অ্যাপ বন্ধ করুন", desc: "Background downloads can affect speed test results." },
  { icon: Wifi, title: "Stay Close to Router", titleBn: "রাউটারের কাছে থাকুন", desc: "If using WiFi, stay within close range of your router." },
  { icon: Zap, title: "Test Multiple Times", titleBn: "একাধিকবার পরীক্ষা করুন", desc: "Run the test 2-3 times for consistent results." },
];

const SpeedTest = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient text-white py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Speed Test</h1>
          <p className="text-2xl font-semibold text-orange-300 mb-4">স্পিড টেস্ট</p>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Check your internet speed right now — powered by Ookla Speedtest.
          </p>
          <p className="text-blue-300 text-sm mt-2">এখনই আপনার ইন্টারনেট স্পিড পরীক্ষা করুন।</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" className="fill-background w-full h-12 md:h-16">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Speed Test Embed */}
      <section className="py-12 md:py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-2 border-galaxy-orange/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-secondary flex items-center justify-center">
                <iframe
                  src="https://fast.com"
                  className="w-full h-full min-h-[400px] border-0"
                  title="Speed Test"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-center mt-4">
            <p className="text-muted-foreground text-sm mb-3">
              Or use Ookla Speedtest for detailed results · অথবা বিস্তারিত ফলাফলের জন্য Ookla ব্যবহার করুন
            </p>
            <a href="https://www.speedtest.net" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-2 border-galaxy-blue text-galaxy-blue hover:bg-galaxy-blue hover:text-white font-semibold">
                Open Speedtest.net
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-galaxy-blue mb-2">Tips for Accurate Results</h2>
            <p className="text-xl font-semibold text-galaxy-orange">সঠিক ফলাফলের জন্য পরামর্শ</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {tips.map((t) => (
              <Card key={t.title} className="border-2 hover:border-galaxy-orange transition-all">
                <CardContent className="p-5 text-center">
                  <t.icon className="h-8 w-8 text-galaxy-orange mx-auto mb-3" />
                  <h3 className="font-bold text-galaxy-blue text-sm">{t.title}</h3>
                  <p className="text-xs text-galaxy-orange font-medium">{t.titleBn}</p>
                  <p className="text-muted-foreground text-xs mt-2">{t.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">
            Not getting the speed you expect? · প্রত্যাশিত স্পিড পাচ্ছেন না?
          </p>
          <a href="/contact">
            <Button className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-semibold">
              Contact Support · সাপোর্টে যোগাযোগ করুন
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SpeedTest;
