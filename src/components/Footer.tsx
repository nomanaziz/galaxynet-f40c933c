import { Link } from "react-router-dom";
import { Wifi, Phone, Mail, MapPin, Facebook, Youtube, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { href: "/", label: t("Home", "হোম") },
    { href: "/packages", label: t("Packages", "প্যাকেজ") },
    { href: "/services", label: t("Services", "সেবা") },
    { href: "/coverage", label: t("Coverage", "কভারেজ") },
    { href: "/about", label: t("About Us", "আমাদের সম্পর্কে") },
    { href: "/contact", label: t("Contact", "যোগাযোগ") },
  ];

  const resourceLinks = [
    { href: "/order", label: t("New Connection", "নতুন সংযোগ") },
    { href: "/speed-test", label: t("Speed Test", "স্পিড টেস্ট") },
    { href: "/notices", label: t("Notices", "নোটিশ") },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Wifi className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-bold">Galaxy Net</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              {t("Fast. Reliable. Affordable.", "দ্রুত। নির্ভরযোগ্য। সাশ্রয়ী।")}
            </p>
            <div className="flex gap-2">
              {[Facebook, Youtube, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 hover:bg-accent transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-accent">
              {t("Quick Links", "দ্রুত লিংক")}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-accent">
              {t("Resources", "রিসোর্স")}
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-accent">
              {t("Contact", "যোগাযোগ")}
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>info@galaxynet.com.bd</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>{t("Dhanmondi, Dhaka-1209", "ধানমন্ডি, ঢাকা-১২০৯")}</span>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-300 font-medium">{t("24/7 Support", "২৪/৭ সাপোর্ট")}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4 text-center text-primary-foreground/50 text-xs">
          © {new Date().getFullYear()} Galaxy Net. {t("All rights reserved.", "সর্বস্বত্ব সংরক্ষিত।")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
