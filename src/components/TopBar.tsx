import { useEffect, useState } from "react";
import { Phone, Facebook, Youtube, MessageCircle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";

const TopBar = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("site_settings").select("key, value").then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
      setSettings(map);
    });
  }, []);

  const notice = t(settings.topbar_notice_en || "", settings.topbar_notice_bn || "");
  const hotline = settings.hotline || "";
  const btrcUrl = settings.btrc_tariff_url || "";

  return (
    <div className="bg-primary text-primary-foreground text-xs py-1.5 border-b border-primary-foreground/10">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex-1 overflow-hidden">
          {notice && (
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-primary-foreground/95">{notice}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {hotline && (
            <a href={`tel:${hotline}`} className="flex items-center gap-1 text-white font-bold hover:text-accent transition-colors">
              <Phone className="h-3 w-3" /> {hotline}
            </a>
          )}
          {btrcUrl && (
            <a href={btrcUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-foreground/90 hover:text-accent transition-colors">
              <FileText className="h-3 w-3" /> {t("BTRC Tariff", "বিটিআরসি ট্যারিফ")}
            </a>
          )}
          <div className="hidden sm:flex items-center gap-1.5">
            {[Facebook, Youtube, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Icon className="h-3 w-3" />
              </a>
            ))}
          </div>
          <ThemeToggle className="text-primary-foreground/90 hover:text-accent" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
