import { useLanguage } from "@/contexts/LanguageContext";
import { UserPlus, Wrench, CreditCard } from "lucide-react";

const steps = [
  { icon: UserPlus, titleEn: "Register", titleBn: "রেজিস্ট্রেশন", descEn: "Fill out the online form or call us to register", descBn: "অনলাইন ফর্ম পূরণ করুন বা কল করুন", step: "01" },
  { icon: Wrench, titleEn: "Installation", titleBn: "ইনস্টলেশন", descEn: "Our expert team will install at your location", descBn: "আমাদের দক্ষ টিম আপনার লোকেশনে ইনস্টল করবে", step: "02" },
  { icon: CreditCard, titleEn: "Start Using", titleBn: "ব্যবহার শুরু", descEn: "Make payment and enjoy high-speed internet", descBn: "পেমেন্ট করুন এবং হাই-স্পিড ইন্টারনেট উপভোগ করুন", step: "03" },
];

const HowToSubscribe = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-20 gradient-navy-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t("How to Get Connected", "কিভাবে সংযুক্ত হবেন")}
          </h2>
          <p className="text-white/60 max-w-lg mx-auto">
            {t("Just 3 simple steps to start your internet journey", "মাত্র ৩টি সহজ ধাপে আপনার ইন্টারনেট যাত্রা শুরু করুন")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((s) => (
            <div key={s.step} className="relative text-center group">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-accent/15 mb-4 group-hover:bg-accent transition-colors">
                <s.icon className="h-9 w-9 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>
              <div className="absolute -top-2 -right-2 md:top-0 md:right-4 h-8 w-8 rounded-full gradient-orange-strip flex items-center justify-center text-white text-xs font-bold">
                {s.step}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t(s.titleEn, s.titleBn)}</h3>
              <p className="text-white/50 text-sm">{t(s.descEn, s.descBn)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToSubscribe;
