import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PageHeroDark from "@/components/PageHeroDark";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import breadcrumbImg from "@/assets/breadcrumb-city.jpg";

interface Location {
  id: string;
  name: string;
  name_bn: string | null;
  type: "district" | "thana" | "zone";
  parent_id: string | null;
}

const Coverage = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [checkResult, setCheckResult] = useState<null | boolean>(null);
  const [checkInput, setCheckInput] = useState(searchParams.get("q") || "");
  const [areas, setAreas] = useState<any[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  // Cascading filter state
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterThana, setFilterThana] = useState("");
  const [filterZone, setFilterZone] = useState("");

  useEffect(() => {
    Promise.all([
      supabase.from("coverage_areas").select("*").order("name"),
      supabase.from("coverage_locations").select("*").order("sort_order"),
    ]).then(([areasRes, locsRes]) => {
      setAreas(areasRes.data ?? []);
      setLocations((locsRes.data ?? []) as Location[]);
      setLoading(false);
    });
  }, []);

  const districts = useMemo(() => locations.filter(l => l.type === "district"), [locations]);
  const thanas = useMemo(() => {
    if (!filterDistrict) return [];
    return locations.filter(l => l.type === "thana" && l.parent_id === filterDistrict);
  }, [locations, filterDistrict]);
  const zones = useMemo(() => {
    if (!filterThana) return [];
    return locations.filter(l => l.type === "zone" && l.parent_id === filterThana);
  }, [locations, filterThana]);

  const locationMap = useMemo(() => {
    const m = new Map<string, Location>();
    locations.forEach(l => m.set(l.id, l));
    return m;
  }, [locations]);

  const getBreadcrumb = (locationId: string | null): string => {
    if (!locationId) return "";
    const parts: string[] = [];
    let current = locationMap.get(locationId);
    while (current) {
      parts.unshift(t(current.name, current.name_bn || current.name));
      current = current.parent_id ? locationMap.get(current.parent_id) : undefined;
    }
    return parts.join(" > ");
  };

  // Get all zone IDs under a thana, or all zone IDs under a district
  const getZoneIdsForDistrict = (distId: string) => {
    const thanaIds = locations.filter(l => l.type === "thana" && l.parent_id === distId).map(l => l.id);
    return locations.filter(l => l.type === "zone" && thanaIds.includes(l.parent_id!)).map(l => l.id);
  };

  const filtered = useMemo(() => {
    return areas.filter((area) => {
      const matchesSearch = search === "" || area.name.toLowerCase().includes(search.toLowerCase()) || (area.name_bn || "").includes(search);

      let matchesLocation = true;
      if (filterZone) {
        matchesLocation = area.location_id === filterZone;
      } else if (filterThana) {
        const zoneIds = locations.filter(l => l.type === "zone" && l.parent_id === filterThana).map(l => l.id);
        matchesLocation = zoneIds.includes(area.location_id);
      } else if (filterDistrict) {
        const zoneIds = getZoneIdsForDistrict(filterDistrict);
        matchesLocation = zoneIds.includes(area.location_id);
      }

      return matchesSearch && matchesLocation;
    });
  }, [areas, search, filterDistrict, filterThana, filterZone, locations]);

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

      <PageHeroDark
        title="Coverage Area"
        titleBn="কভারেজ এলাকা"
        subtitle="Check if Galaxy Net is available in your area"
        subtitleBn="আপনার এলাকায় গ্যালাক্সি নেট আছে কিনা দেখুন"
        bgImage={breadcrumbImg}
      />

      {/* Check area section */}
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

      {/* Areas listing */}
      <section className="py-12 bg-secondary/50 flex-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">{t("Covered Areas", "আমাদের সেবা এলাকা")}</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : (
            <>
              {/* Cascading filters */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-end mb-8 max-w-3xl mx-auto">
                <div className="w-full sm:w-auto">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("District", "জেলা")}</label>
                  <Select value={filterDistrict} onValueChange={(v) => { setFilterDistrict(v === "all" ? "" : v); setFilterThana(""); setFilterZone(""); }}>
                    <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder={t("All Districts", "সকল জেলা")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Districts", "সকল জেলা")}</SelectItem>
                      {districts.map(d => <SelectItem key={d.id} value={d.id}>{t(d.name, d.name_bn || d.name)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-auto">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("Thana", "থানা")}</label>
                  <Select value={filterThana} onValueChange={(v) => { setFilterThana(v === "all" ? "" : v); setFilterZone(""); }} disabled={!filterDistrict}>
                    <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder={t("All Thanas", "সকল থানা")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Thanas", "সকল থানা")}</SelectItem>
                      {thanas.map(t2 => <SelectItem key={t2.id} value={t2.id}>{t(t2.name, t2.name_bn || t2.name)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-auto">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("Zone", "জোন")}</label>
                  <Select value={filterZone} onValueChange={(v) => setFilterZone(v === "all" ? "" : v)} disabled={!filterThana}>
                    <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder={t("All Zones", "সকল জোন")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Zones", "সকল জোন")}</SelectItem>
                      {zones.map(z => <SelectItem key={z.id} value={z.id}>{t(z.name, z.name_bn || z.name)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full sm:w-auto">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("Search", "খুঁজুন")}</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t("Search...", "খুঁজুন...")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full sm:w-48" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filtered.map((area) => (
                  <div key={area.id} className={`flex flex-col items-center text-center p-4 rounded-xl bg-background border hover:border-accent/40 hover:shadow-sm transition-all ${!area.available ? "opacity-50" : ""}`}>
                    <MapPin className="h-5 w-5 text-accent mb-2" />
                    <p className="font-medium text-foreground text-sm">{t(area.name, area.name_bn || area.name)}</p>
                    {area.location_id && (
                      <p className="text-xs text-muted-foreground mt-1">{getBreadcrumb(area.location_id)}</p>
                    )}
                    {!area.location_id && (area.zone || area.district) && (
                      <Badge variant="secondary" className="mt-2 text-xs">{area.zone || area.district}</Badge>
                    )}
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
