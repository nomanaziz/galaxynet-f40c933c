import { useEffect, useState } from "react";
import { Phone, Facebook, Youtube, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

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
            <a href={`tel:${hotline}`} className="flex items-center gap-1 text-accent font-semibold hover:text-accent/80 transition-colors">
              <Phone className="h-3 w-3" /> {hotline}
            </a>
          )}
          <div className="hidden sm:flex items-center gap-1.5">
            {[Facebook, Youtube, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Icon className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
