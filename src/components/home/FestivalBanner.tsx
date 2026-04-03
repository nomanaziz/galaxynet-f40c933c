import { useLanguage } from "@/contexts/LanguageContext";
import type { FestivalTheme } from "@/hooks/useFestivalTheme";
import { Sparkles } from "lucide-react";

interface Props {
  festival: FestivalTheme;
}

const FestivalBanner = ({ festival }: Props) => {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 pointer-events-auto">
        <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
        <span className="text-white text-sm font-medium">
          {t(festival.greeting_en || festival.name, festival.greeting_bn || festival.name_bn || festival.name)}
        </span>
        {(festival.banner_text_en || festival.banner_text_bn) && (
          <>
            <span className="text-white/40">•</span>
            <span className="text-white/70 text-xs">
              {t(festival.banner_text_en || "", festival.banner_text_bn || festival.banner_text_en || "")}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default FestivalBanner;
