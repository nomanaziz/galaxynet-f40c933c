import { useLanguage } from "@/contexts/LanguageContext";

const cacheLogos = [
  { name: "Google", color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Meta", color: "text-blue-500", bg: "bg-blue-50" },
  { name: "YouTube", color: "text-red-600", bg: "bg-red-50" },
  { name: "Netflix", color: "text-red-700", bg: "bg-red-50" },
  { name: "TikTok", color: "text-gray-900", bg: "bg-gray-50" },
  { name: "Steam", color: "text-indigo-700", bg: "bg-indigo-50" },
  { name: "Apple", color: "text-gray-800", bg: "bg-gray-50" },
  { name: "Cloudflare", color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Akamai", color: "text-blue-700", bg: "bg-blue-50" },
  { name: "Microsoft", color: "text-sky-600", bg: "bg-sky-50" },
  { name: "Amazon", color: "text-amber-600", bg: "bg-amber-50" },
  { name: "Facebook", color: "text-blue-600", bg: "bg-blue-50" },
];

const CacheMarquee = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10 bg-[hsl(40,40%,96%)] overflow-hidden">
      <div className="container mx-auto px-4 mb-5">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold uppercase tracking-wider">
            ⚡ {t("Most Cache Servers in the Country", "দেশের সবচেয়ে বেশি ক্যাশ সার্ভার")}
          </span>
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            {t("Connected to Premium Cache Servers", "প্রিমিয়াম ক্যাশ সার্ভারে সংযুক্ত")}
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee-loop whitespace-nowrap">
          {[...cacheLogos, ...cacheLogos].map((logo, i) => (
            <div
              key={i}
              className={`inline-flex items-center justify-center mx-4 md:mx-6 px-6 py-3 rounded-xl ${logo.bg} border border-border shadow-sm min-w-[130px] hover:shadow-md transition-shadow`}
            >
              <span className={`${logo.color} font-bold text-base tracking-tight`}>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CacheMarquee;
