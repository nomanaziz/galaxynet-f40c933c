import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Wifi, ChevronDown, Globe, User, LogIn, LogOut, ExternalLink, Shield, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: string;
  label: string;
  label_bn: string | null;
  url: string;
  parent_id: string | null;
  sort_order: number;
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selfcareUrl, setSelfcareUrl] = useState("");

  useEffect(() => {
    // Fetch menu items
    supabase
      .from("menu_items")
      .select("*")
      .eq("visible", true)
      .is("parent_id", null)
      .order("sort_order")
      .then(({ data }) => setMenuItems((data as MenuItem[]) ?? []));

    // Fetch selfcare URL
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["selfcare_url", "selfcare_enabled"])
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
        if (map.selfcare_enabled !== "false") {
          setSelfcareUrl(map.selfcare_url || "");
        }
      });
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          setTimeout(async () => {
            const { data } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", u.id)
              .maybeSingle();
            setIsAdmin(data?.role === "super_admin" || data?.role === "admin");
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    navigate("/");
  };

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const getLabel = (item: MenuItem) => t(item.label, item.label_bn || item.label);

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
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.url}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.url)
                  ? "text-accent bg-accent/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {getLabel(item)}
            </Link>
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

          {selfcareUrl && (
            <a href={selfcareUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="font-medium text-accent border-accent hover:bg-accent hover:text-accent-foreground">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                {t("Selfcare", "সেলফকেয়ার")}
              </Button>
            </a>
          )}

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user ? (
                <>
                  <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="h-4 w-4 mr-2" />
                      {t("Admin Panel", "অ্যাডমিন প্যানেল")}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("Logout", "লগআউট")}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate("/login")}>
                    <LogIn className="h-4 w-4 mr-2" />
                    {t("Login", "লগইন")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/register")}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t("Sign Up", "সাইন আপ")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
                {menuItems.map((item) => (
                  <SheetClose asChild key={item.id}>
                    <Link
                      to={item.url}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.url)
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {getLabel(item)}
                    </Link>
                  </SheetClose>
                ))}

                {selfcareUrl && (
                  <a href={selfcareUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    {t("Selfcare", "সেলফকেয়ার")}
                  </a>
                )}

                <div className="pt-4 mt-2 border-t border-border space-y-1">
                  {user ? (
                    <>
                      {isAdmin && (
                        <SheetClose asChild>
                          <Link to="/admin" className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                            <Shield className="h-4 w-4" />
                            {t("Admin Panel", "অ্যাডমিন প্যানেল")}
                          </Link>
                        </SheetClose>
                      )}
                      <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                        <LogOut className="h-4 w-4" />
                        {t("Logout", "লগআউট")}
                      </button>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link to="/login">
                          <Button className="w-full" variant="outline">
                            <LogIn className="h-4 w-4 mr-1.5" />
                            {t("Login", "লগইন")}
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/register">
                          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                            <UserPlus className="h-4 w-4 mr-1.5" />
                            {t("Sign Up", "সাইন আপ")}
                          </Button>
                        </Link>
                      </SheetClose>
                    </>
                  )}
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
