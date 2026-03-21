import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wifi, ChevronDown, Globe, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { href: "/", label: t("Home", "হোম") },
    { href: "/packages", label: t("Packages", "প্যাকেজ") },
    { href: "/services", label: t("Services", "সেবা"), hasDropdown: true },
    { href: "/coverage", label: t("Coverage", "কভারেজ") },
    { href: "/about", label: t("About", "আমাদের সম্পর্কে") },
    { href: "/contact", label: t("Contact", "যোগাযোগ") },
  ];

  const serviceDropdown = [
    { href: "/services", label: t("Broadband", "ব্রডব্যান্ড") },
    { href: "/services", label: t("Corporate", "কর্পোরেট") },
    { href: "/services", label: t("CCTV", "সিসিটিভি") },
    { href: "/services", label: t("Networking", "নেটওয়ার্কিং") },
  ];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Wifi className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Galaxy Net</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.href + link.label} className="relative group">
              <Link
                to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  isActive(link.href)
                    ? "text-accent bg-accent/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
              {link.hasDropdown && (
                <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
                    {serviceDropdown.map((item, i) => (
                      <Link
                        key={i}
                        to={item.href}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Globe className="h-4 w-4" />
            {language === "bn" ? "EN" : "বাং"}
          </button>
          <Link to="/contact">
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-5">
              {t("Contact Us", "যোগাযোগ")}
            </Button>
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-medium text-muted-foreground"
          >
            <Globe className="h-4 w-4" />
            {language === "bn" ? "EN" : "বাং"}
          </button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0 bg-background">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                    <Wifi className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <span className="font-bold text-foreground">Galaxy Net</span>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href + link.label}>
                    <Link
                      to={link.href}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="pt-4 mt-2 border-t border-border">
                  <SheetClose asChild>
                    <Link to="/contact">
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                        {t("Contact Us", "যোগাযোগ করুন")}
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
