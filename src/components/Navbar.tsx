import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home", labelBn: "হোম" },
  { href: "/packages", label: "Packages", labelBn: "প্যাকেজ" },
  { href: "/services", label: "Services", labelBn: "সেবা" },
  { href: "/coverage", label: "Coverage", labelBn: "কভারেজ" },
  { href: "/about", label: "About", labelBn: "আমাদের সম্পর্কে" },
  { href: "/contact", label: "Contact", labelBn: "যোগাযোগ" },
];

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full shadow-md" style={{ background: "hsl(var(--galaxy-blue-dark))" }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-galaxy-orange">
            <Wifi className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white leading-none">Galaxy Net</span>
            <p className="text-xs text-orange-300 leading-none">গ্যালাক্সি নেট</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`flex flex-col items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-galaxy-orange text-white"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{link.label}</span>
              <span className="text-xs opacity-75">{link.labelBn}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/order">
            <Button className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-semibold px-5 animate-pulse-orange">
              Order Now · অর্ডার করুন
            </Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0" style={{ background: "hsl(var(--galaxy-blue-dark))" }}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-galaxy-orange">
                  <Wifi className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-white">Galaxy Net</span>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </div>
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    to={link.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-galaxy-orange text-white"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-sm opacity-75">{link.labelBn}</span>
                  </Link>
                </SheetClose>
              ))}
              <div className="pt-4 border-t border-white/10 mt-2">
                <SheetClose asChild>
                  <Link to="/order">
                    <Button className="w-full bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-semibold">
                      Order Now · অর্ডার করুন
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
