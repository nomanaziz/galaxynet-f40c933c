import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PageHeroDarkProps {
  title: string;
  titleBn: string;
  subtitle?: string;
  subtitleBn?: string;
  bgImage: string;
}

const PageHeroDark = ({ title, titleBn, subtitle, subtitleBn, bgImage }: PageHeroDarkProps) => {
  const { t } = useLanguage();

  return (
    <section className="page-hero-dark">
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
          {t(title, titleBn)}
        </h1>
        {subtitle && (
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-4">
            {t(subtitle, subtitleBn || subtitle)}
          </p>
        )}
        <div className="flex items-center justify-center gap-1.5 text-sm text-white/60">
          <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
            <Home className="h-3.5 w-3.5" />
            {t("Home", "হোম")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-accent font-medium">{t(title, titleBn)}</span>
        </div>
      </div>
    </section>
  );
};

export default PageHeroDark;
