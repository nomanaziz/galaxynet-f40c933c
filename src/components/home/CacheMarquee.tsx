import { useLanguage } from "@/contexts/LanguageContext";

const cacheLogos = [
  { name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" },
  { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png" },
  { name: "YouTube", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/200px-YouTube_Logo_2017.svg.png" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png" },
  { name: "TikTok", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/150px-TikTok_logo.svg.png" },
  { name: "Steam", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/120px-Steam_icon_logo.svg.png" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/100px-Apple_logo_black.svg.png" },
  { name: "Cloudflare", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Cloudflare_Logo.png/200px-Cloudflare_Logo.png" },
  { name: "Akamai", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Akamai_logo.svg/200px-Akamai_logo.svg.png" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/200px-Microsoft_logo_%282012%29.svg.png" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png" },
  { name: "Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/200px-Facebook_Logo_%282019%29.png" },
];

const LogoItem = ({ logo }: { logo: typeof cacheLogos[0] }) => {
  return (
    <div className="inline-flex items-center justify-center mx-3 md:mx-5 px-5 py-3 rounded-xl bg-white border border-border shadow-sm min-w-[120px] h-[56px] hover:shadow-md transition-shadow">
      <img
        src={logo.logo}
        alt={logo.name}
        className="max-h-[28px] max-w-[100px] object-contain"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = "block";
        }}
      />
      <span className="font-bold text-sm text-foreground tracking-tight hidden">{logo.name}</span>
    </div>
  );
};

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
            <LogoItem key={i} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CacheMarquee;
