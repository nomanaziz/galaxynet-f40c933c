import { useLanguage } from "@/contexts/LanguageContext";
import type { FestivalTheme } from "@/hooks/useFestivalTheme";
import { Moon, Sun } from "lucide-react";

interface Props {
  festival: FestivalTheme;
  iftarCountdown: string;
}

const RamadanPanel = ({ festival, iftarCountdown }: Props) => {
  const { t } = useLanguage();

  return (
    <section className="py-6 bg-[hsl(215,60%,6%)]">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto bg-[hsl(215,50%,10%)] border border-yellow-500/20 rounded-2xl p-5 shadow-[0_0_30px_-10px_hsl(45_100%_50%/0.15)]">
          <div className="text-center mb-4">
            <Moon className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
            <h3 className="text-lg font-bold text-yellow-400">
              {t("Ramadan Mubarak", "রমজান মুবারক")}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Sehri */}
            <div className="text-center p-3 rounded-xl bg-[hsl(215,40%,14%)] border border-yellow-500/10">
              <Moon className="h-4 w-4 text-yellow-400/70 mx-auto mb-1" />
              <p className="text-xs text-yellow-400/60 mb-1">{t("Sehri", "সেহরি")}</p>
              <p className="text-lg font-bold text-white">{festival.sehri_time || "--:--"}</p>
            </div>
            {/* Iftar */}
            <div className="text-center p-3 rounded-xl bg-[hsl(215,40%,14%)] border border-yellow-500/10">
              <Sun className="h-4 w-4 text-yellow-400/70 mx-auto mb-1" />
              <p className="text-xs text-yellow-400/60 mb-1">{t("Iftar", "ইফতার")}</p>
              <p className="text-lg font-bold text-white">{festival.iftar_time || "--:--"}</p>
            </div>
          </div>

          {/* Countdown */}
          {iftarCountdown && (
            <div className="text-center p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
              <p className="text-xs text-yellow-400/60 mb-1">{t("Iftar Countdown", "ইফতার কাউন্টডাউন")}</p>
              <p className="text-2xl font-mono font-bold text-yellow-400 tracking-wider">{iftarCountdown}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RamadanPanel;
