import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Youtube, MessageCircle, Wifi, Tv, Gamepad2, Cable, Gift, HeadphonesIcon } from "lucide-react";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const footerServices = [
  { icon: Wifi, label: "Fast Internet", label_bn: "ফাস্ট ইন্টারনেট" },
  { icon: Tv, label: "4K TV", label_bn: "৪কে টিভি" },
  { icon: Gamepad2, label: "Gaming", label_bn: "গেমিং" },
  { icon: Cable, label: "Fiber Optic", label_bn: "ফাইবার অপটিক" },
  { icon: Gift, label: "Promo", label_bn: "প্রোমো" },
  { icon: HeadphonesIcon, label: "24/7 Support", label_bn: "সাপোর্ট" },
];

const Footer = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("site_settings").select("key, value").then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
      setSettings(map);
    });
  }, []);

  const phone = settings.phone || "+880 1700-000000";
  const email = settings.email || "info@galaxynet.com.bd";
  const address = t(settings.address || "Dhaka, Bangladesh", settings.address_bn || settings.address || "ঢাকা, বাংলাদেশ");
  const facebookUrl = settings.facebook || "#";
  const siteName = settings.website_name || "Galaxy Net";
  const tagline = settings.tagline || t("Fast. Reliable. Affordable.", "দ্রুত। নির্ভরযোগ্য। সাশ্রয়ী।");

  const quickLinks = [
    { href: "/", label: t("Home", "হোম") },
    { href: "/packages", label: t("Packages", "প্যাকেজ") },
    { href: "/services", label: t("Services", "সেবা") },
    { href: "/coverage", label: t("Coverage", "কভারেজ") },
    { href: "/about", label: t("About Us", "আমাদের সম্পর্কে") },
    { href: "/contact", label: t("Contact", "যোগাযোগ") },
  ];

  const btrcUrl = settings.btrc_tariff_url || "";

  const resourceLinks = [
    { href: "/order", label: t("New Connection", "নতুন সংযোগ") },
    { href: "/speed-test", label: t("Speed Test", "স্পিড টেস্ট") },
    { href: "/notices", label: t("Notices", "নোটিশ") },
    { href: "/pay-bill", label: t("Pay Bill", "বিল পরিশোধ") },
    { href: "/offers", label: t("Offers", "অফার") },
  ];

  return (
    <>
      <footer className="footer-galaxy text-primary-foreground">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src={logo} alt={siteName} className="h-10 w-auto brightness-0 invert" />
              </div>
              <p className="text-primary-foreground/90 text-sm leading-relaxed mb-4">
                {tagline}
              </p>
              <div className="flex gap-2">
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 hover:bg-accent transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                {[Youtube, MessageCircle].map((Icon, i) => (
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
                    <Link to={link.href} className="text-sm text-primary-foreground/90 hover:text-accent transition-colors">
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
                    <Link to={link.href} className="text-sm text-primary-foreground/90 hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {btrcUrl && (
                  <li>
                    <a href={btrcUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/90 hover:text-accent transition-colors">
                      {t("BTRC Approved Tariff", "বিটিআরসি অনুমোদিত ট্যারিফ")}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-accent">
                {t("Contact", "যোগাযোগ")}
              </h4>
              <ul className="space-y-3 text-sm text-primary-foreground/90">
                <li className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-accent transition-colors">{phone}</a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-accent transition-colors">{email}</a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                  <span>{address}</span>
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
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-primary-foreground/80 text-xs relative z-10">
            <span>© {new Date().getFullYear()} {siteName}. {t("All rights reserved.", "সর্বস্বত্ব সংরক্ষিত।")}</span>
            <span>Developed by: <a href="https://finehost.net" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">FineHost.net</a></span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
