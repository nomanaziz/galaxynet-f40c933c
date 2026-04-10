import { Link } from "react-router-dom";
import { Wifi } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FloatingCTA = () => {
  const { t } = useLanguage();

  return (
    <Link
      to="/new-connection"
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 group"
      aria-label="Get new connection"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
      {/* Glow */}
      <span className="absolute -inset-1 rounded-full bg-accent/30 blur-md group-hover:opacity-60 transition-opacity" />
      {/* Button */}
      <span className="relative h-14 w-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg transition-all group-hover:scale-110">
        <Wifi className="h-6 w-6" />
      </span>
      {/* Tooltip */}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
        {t("Get Connected Today", "আজকেই কানেকশন নিন")}
      </span>
    </Link>
  );
};

export default FloatingCTA;
