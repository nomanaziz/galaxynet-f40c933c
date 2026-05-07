import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  className?: string;
}

const ThemeToggle = ({ className = "" }: Props) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t(isDark ? "Switch to light mode" : "Switch to dark mode", isDark ? "লাইট মোডে যান" : "ডার্ক মোডে যান")}
      title={t(isDark ? "Light mode" : "Dark mode", isDark ? "লাইট মোড" : "ডার্ক মোড")}
      className={`inline-flex items-center justify-center rounded-full p-1.5 hover:bg-primary-foreground/10 transition-colors ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

export default ThemeToggle;
