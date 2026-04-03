import { useLanguage } from "@/contexts/LanguageContext";

const cacheLogos = [
  "Google", "Facebook", "YouTube", "Netflix", "TikTok",
  "Amazon", "Cloudflare", "Akamai", "Microsoft", "Apple",
];

const CacheMarquee = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10 bg-secondary/80 overflow-hidden">
      <div className="container mx-auto px-4 mb-4">
        <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          {t("Connected to Premium Cache Servers", "প্রিমিয়াম ক্যাশ সার্ভারে সংযুক্ত")}
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee-loop whitespace-nowrap">
          {[...cacheLogos, ...cacheLogos].map((logo, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center mx-6 md:mx-10 px-5 py-2 rounded-lg bg-background border border-border shadow-sm min-w-[120px]"
            >
              <span className="text-foreground font-semibold text-sm">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CacheMarquee;
