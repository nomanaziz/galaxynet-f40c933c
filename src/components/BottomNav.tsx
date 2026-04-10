import { Link, useLocation } from "react-router-dom";
import { Home, Server, Info, Package, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const navItems = [
  { path: "/", icon: Home, en: "Home", bn: "হোম" },
  { path: "/services", icon: Server, en: "Services", bn: "সার্ভিস" },
  { path: "/about", icon: Info, en: "About", bn: "সম্পর্কে" },
  { path: "/packages", icon: Package, en: "Packages", bn: "প্যাকেজ" },
  { path: "/contact", icon: Phone, en: "Contact", bn: "যোগাযোগ" },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const active = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 transition-colors ${
                active ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{t(item.en, item.bn)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
