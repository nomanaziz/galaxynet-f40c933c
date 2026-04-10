import { useState } from "react";
import { Link } from "react-router-dom";
import { Wifi, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FloatingCTA = () => {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 md:bottom-8 md:left-6 z-50 group">
      {/* Mobile close button */}
      <button
        onClick={(e) => { e.preventDefault(); setDismissed(true); }}
        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-foreground/80 text-background flex items-center justify-center md:hidden z-10"
        aria-label="Close"
      >
        <X className="h-3 w-3" />
      </button>

      <Link to="/new-connection" aria-label="Get new connection">
        <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
        <span className="absolute -inset-1 rounded-full bg-accent/30 blur-md group-hover:opacity-60 transition-opacity" />
        <span className="relative h-11 w-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg transition-all group-hover:scale-110">
          <Wifi className="h-5 w-5" />
        </span>
        <span className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          {t("Get Connected Today", "আজকেই কানেকশন নিন")}
        </span>
      </Link>
    </div>
  );
};

export default FloatingCTA;
