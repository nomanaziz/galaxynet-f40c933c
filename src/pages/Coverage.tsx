import { useState, useEffect } from "react";
import { Search, MapPin, CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Coverage = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedZone, setSelectedZone] = useState("All");
  const [checkResult, setCheckResult] = useState<null | boolean>(null);
  const [checkInput, setCheckInput] = useState(searchParams.get("q") || "");
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    supabase.from("coverage_areas").select("*").order("name").then(({ data }) => {
      setAreas(data ?? []);
      setLoading(false);
    });
  }, []);

  const zones = ["All", ...Array.from(new Set(areas.map(a => a.zone).filter(Boolean)))];

  const filtered = areas.filter((area) => {
    const matchesZone = selectedZone === "All" || area.zone === selectedZone;
    const matchesSearch = search === "" || area.name.toLowerCase().includes(search.toLowerCase()) || (area.name_bn || "").includes(search);
    return matchesZone && matchesSearch;
  });

  const handleCheck = () => {
    if (!checkInput.trim()) return;
    const found = areas.some(
      (area) => area.available && (area.name.toLowerCase().includes(checkInput.toLowerCase()) || (area.name_bn || "").includes(checkInput))
    );
    setCheckResult(found);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />

      <section className="page-hero">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{t("Coverage Area", "কভারেজ এলাকা")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t("Check if Galaxy Net is available in your area", "আপনার এলাকায় গ্যালাক্সি নেট আছে কিনা দেখুন")}
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="p-6 rounded-2xl border bg-card">
            <h2 className="text-lg font-bold text-foreground mb-4 text-center">{t("Check Your Area", "আপনার এলাকা চেক করুন")}</h2>
            <div className="flex gap-3">
              <Input
                placeholder={t("Type your area name...", "এলাকার নাম লিখুন...")}
                value={checkInput}
                onChange={(e) => { setCheckInput(e.target.value); setCheckResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              />
              <Button onClick={handleCheck} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shrink-0">
                <Search className="h-4 w-4 mr-1" /> {t("Check", "চেক")}
              </Button>
            </div>
            {checkResult !== null && (
              <div className={`mt-4 flex items-start gap-3 p-4 rounded-lg ${checkResult ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                {checkResult ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-700 text-sm">{t("Available! We cover your area.", "পাওয়া যায়! আমরা আপনার এলাকায় আছি।")}</p>
                      <Link to="/contact" className="inline-block mt-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                          {t("Contact Us", "যোগাযোগ করুন")} <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-700 text-sm">{t("Not available yet.", "এখনো পাওয়া যাচ্ছে না।")}</p>
                      <Link to="/contact" className="inline-block mt-2">
                        <Button size="sm" variant="outline" className="border-red-300 text-red-600 font-semibold">
                          {t("Request Connection", "সংযোগের আবেদন")}
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-secondary/50 flex-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">{t("Covered Areas", "আমাদের সেবা এলাকা")}</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex flex-wrap gap-2">
                  {zones.map((zone) => (
                    <button
                      key={zone}
                      onClick={() => setSelectedZone(zone)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        selectedZone === zone ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/40"
                      }`}
                    >
                      {zone === "All" ? t("All", "সব") : zone}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t("Search...", "খুঁজুন...")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-48" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filtered.map((area) => (
                  <div key={area.id} className={`flex flex-col items-center text-center p-4 rounded-xl bg-background border hover:border-accent/40 hover:shadow-sm transition-all ${!area.available ? "opacity-50" : ""}`}>
                    <MapPin className="h-5 w-5 text-accent mb-2" />
                    <p className="font-medium text-foreground text-sm">{t(area.name, area.name_bn || area.name)}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">{area.zone || area.district}</Badge>
                    {!area.available && <span className="text-xs text-destructive mt-1">{t("Coming Soon", "শীঘ্রই আসছে")}</span>}
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("No areas found", "কোনো এলাকা পাওয়া যায়নি")}</p>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">
              {t("Don't see your area?", "আপনার এলাকা নেই?")}{" "}
              <Link to="/contact" className="text-accent font-semibold hover:underline">
                {t("Contact us", "যোগাযোগ করুন")}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Coverage;
