import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Zap, HeadphonesIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const points = [
  { icon: Shield, titleEn: "Reliable Network", titleBn: "নির্ভরযোগ্য নেটওয়ার্ক", descEn: "99.9% uptime with redundant fiber backbone", descBn: "রিডান্ড্যান্ট ফাইবার ব্যাকবোনে ৯৯.৯% আপটাইম" },
  { icon: Zap, titleEn: "Lightning-Fast Speeds", titleBn: "বিদ্যুৎ গতিতে স্পিড", descEn: "Up to 1 Gbps for seamless streaming & gaming", descBn: "নিরবচ্ছিন্ন স্ট্রিমিং ও গেমিংয়ের জন্য ১ Gbps পর্যন্ত" },
  { icon: HeadphonesIcon, titleEn: "24/7 Support", titleBn: "২৪/৭ সাপোর্ট", descEn: "Dedicated support team always ready to help", descBn: "নিবেদিত সাপোর্ট টিম সবসময় সাহায্যে প্রস্তুত" },
];

const WhoWeAre = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-2">
              {t("Who We Are", "আমরা কারা")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {t("Your Trusted Internet Partner", "আপনার বিশ্বস্ত ইন্টারনেট পার্টনার")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Galaxy Net has been providing high-quality internet services since 2015. We're committed to keeping you connected with the fastest and most reliable fiber optic network.",
                "গ্যালাক্সি নেট ২০১৫ সাল থেকে উচ্চ মানের ইন্টারনেট সেবা প্রদান করে আসছে। দ্রুততম ও সবচেয়ে নির্ভরযোগ্য ফাইবার অপটিক নেটওয়ার্কে আপনাকে সংযুক্ত রাখতে আমরা প্রতিশ্রুতিবদ্ধ।"
              )}
            </p>
            <Link to="/about">
              <Button variant="outline" className="font-semibold">
                {t("Learn More", "আরও জানুন")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {points.map((p) => (
              <div key={p.titleEn} className="flex gap-4 items-start p-4 rounded-xl border hover:border-accent/40 transition-all hover:shadow-sm bg-card">
                <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <p.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{t(p.titleEn, p.titleBn)}</h3>
                  <p className="text-muted-foreground text-xs mt-0.5">{t(p.descEn, p.descBn)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
