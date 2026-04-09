import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeroDark from "@/components/PageHeroDark";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import breadcrumbImg from "@/assets/breadcrumb-city.jpg";
import {
  CoverageLocation,
  CoverageArea,
  buildLocationMap,
  buildDisabledLocationIds,
  getLocationBreadcrumb,
  getDescendantIds,
  getAncestorOfType,
  buildAreaSortKey,
} from "@/lib/coverageHierarchy";

// Division accent border colors (HSL-based semantic approach)
const DIVISION_COLORS: Record<string, string> = {
  "Dhaka": "border-l-blue-500",
  "Chattogram": "border-l-emerald-500",
  "Rajshahi": "border-l-orange-500",
  "Khulna": "border-l-teal-500",
  "Barisal": "border-l-cyan-500",
  "Sylhet": "border-l-green-500",
  "Rangpur": "border-l-purple-500",
  "Mymensingh": "border-l-rose-500",
};

// District-level decorative emoji icons
const DISTRICT_ICONS: Record<string, string> = {
  "Dhaka": "🕌", "Gazipur": "🏭", "Narayanganj": "🧵", "Tangail": "🧶",
  "Manikganj": "🌾", "Munshiganj": "⛵", "Narsingdi": "🪡", "Madaripur": "🚣",
  "Shariatpur": "🌊", "Faridpur": "🏛️", "Gopalganj": "🏠", "Rajbari": "🌿",
  "Kishoreganj": "🐟", "Chattogram": "⛰️", "Cox's Bazar": "🏖️",
  "Comilla": "🍚", "Noakhali": "🌶️", "Feni": "🌳", "Lakshmipur": "🐄",
  "Chandpur": "🚢", "Brahmanbaria": "📚", "Rangamati": "🏔️",
  "Bandarban": "🗻", "Khagrachhari": "🌄", "Rajshahi": "🥭",
  "Chapainawabganj": "🍇", "Naogaon": "🏛️", "Natore": "🌸",
  "Nawabganj": "🥭", "Pabna": "🧈", "Sirajganj": "🧣",
  "Bogra": "🍶", "Joypurhat": "🌻", "Khulna": "🐅",
  "Satkhira": "🦐", "Jessore": "🌺", "Bagerhat": "🕌",
  "Narail": "🥥", "Magura": "🌾", "Kushtia": "📖",
  "Meherpur": "🏡", "Chuadanga": "🌽", "Jhenaidah": "🍈",
  "Barisal": "🚤", "Patuakhali": "🐠", "Bhola": "🏝️",
  "Pirojpur": "🥥", "Barguna": "🦀", "Jhalokathi": "🌴",
  "Sylhet": "🍵", "Moulvibazar": "🍃", "Habiganj": "🌱",
  "Sunamganj": "🐦", "Rangpur": "🌾", "Dinajpur": "🍚",
  "Nilphamari": "🌿", "Kurigram": "🌊", "Lalmonirhat": "🚂",
  "Gaibandha": "🐃", "Thakurgaon": "🧱", "Panchagarh": "🏔️",
  "Mymensingh": "🌉", "Jamalpur": "🌾", "Sherpur": "🦌",
  "Netrokona": "🎣",
};

const Coverage = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [checkResult, setCheckResult] = useState<null | boolean>(null);
  const [checkInput, setCheckInput] = useState(searchParams.get("q") || "");
  const [areas, setAreas] = useState<CoverageArea[]>([]);
  const [locations, setLocations] = useState<CoverageLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const [filterDivision, setFilterDivision] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterThana, setFilterThana] = useState("");
  const [filterZone, setFilterZone] = useState("");

  useEffect(() => {
    Promise.all([
      supabase.from("coverage_areas").select("*").order("name"),
      supabase.from("coverage_locations").select("*").order("sort_order"),
    ]).then(([areasRes, locsRes]) => {
      setAreas((areasRes.data ?? []) as CoverageArea[]);
      setLocations((locsRes.data ?? []) as CoverageLocation[]);
      setLoading(false);
    });
  }, []);

  const locationMap = useMemo(() => buildLocationMap(locations), [locations]);
  const disabledLocationIds = useMemo(() => buildDisabledLocationIds(locations, locationMap), [locations, locationMap]);
  const enabledLocations = useMemo(() => locations.filter(l => !disabledLocationIds.has(l.id)), [locations, disabledLocationIds]);

  const divisions = useMemo(() => enabledLocations.filter(l => l.type === "division"), [enabledLocations]);
  const districts = useMemo(() => {
    if (!filterDivision) return [];
    return enabledLocations.filter(l => l.type === "district" && l.parent_id === filterDivision);
  }, [enabledLocations, filterDivision]);
  const thanas = useMemo(() => {
    if (!filterDistrict) return [];
    return enabledLocations.filter(l => l.type === "thana" && l.parent_id === filterDistrict);
  }, [enabledLocations, filterDistrict]);
  const zones = useMemo(() => {
    if (!filterThana) return [];
    return enabledLocations.filter(l => l.type === "zone" && l.parent_id === filterThana);
  }, [enabledLocations, filterThana]);

  const filtered = useMemo(() => {
    return areas.filter((area) => {
      if (area.location_id && disabledLocationIds.has(area.location_id)) return false;
      if (!area.available) return false;

      const matchesSearch = search === "" || area.name.toLowerCase().includes(search.toLowerCase()) || (area.name_bn || "").includes(search);

      let matchesLocation = true;
      if (filterZone) {
        matchesLocation = area.location_id === filterZone;
      } else if (filterThana) {
        const zoneIds = enabledLocations.filter(l => l.type === "zone" && l.parent_id === filterThana).map(l => l.id);
        matchesLocation = area.location_id === filterThana || zoneIds.includes(area.location_id ?? "");
      } else if (filterDistrict) {
        const thanaIds = enabledLocations.filter(l => l.type === "thana" && l.parent_id === filterDistrict).map(l => l.id);
        const zoneIds = enabledLocations.filter(l => l.type === "zone" && thanaIds.includes(l.parent_id!)).map(l => l.id);
        matchesLocation = thanaIds.includes(area.location_id ?? "") || zoneIds.includes(area.location_id ?? "");
      } else if (filterDivision) {
        const allIds = getDescendantIds(filterDivision, enabledLocations);
        matchesLocation = allIds.includes(area.location_id ?? "");
      }

      return matchesSearch && matchesLocation;
    });
  }, [areas, search, filterDivision, filterDistrict, filterThana, filterZone, enabledLocations, disabledLocationIds]);

  // Sort filtered areas by Division > District > Thana > Zone > Name
  const sortedFiltered = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const keyA = buildAreaSortKey(a, locationMap);
      const keyB = buildAreaSortKey(b, locationMap);
      for (let i = 0; i < 4; i++) {
        if ((keyA[i] as number) !== (keyB[i] as number)) return (keyA[i] as number) - (keyB[i] as number);
      }
      return (keyA[4] as string).localeCompare(keyB[4] as string);
    });
  }, [filtered, locationMap]);

  // Group sorted areas by division for headers
  const groupedByDivision = useMemo(() => {
    const groups: { division: CoverageLocation | null; areas: CoverageArea[] }[] = [];
    let currentDivId: string | null = null;
    for (const area of sortedFiltered) {
      const div = getAncestorOfType(area.location_id, "division", locationMap);
      const divId = div?.id ?? null;
      if (divId !== currentDivId) {
        groups.push({ division: div, areas: [area] });
        currentDivId = divId;
      } else {
        groups[groups.length - 1].areas.push(area);
      }
    }
    return groups;
  }, [sortedFiltered, locationMap]);

  const handleCheck = () => {
    if (!checkInput.trim()) return;
    const found = areas.some(
      (area) => area.available && !(area.location_id && disabledLocationIds.has(area.location_id)) &&
        (area.name.toLowerCase().includes(checkInput.toLowerCase()) || (area.name_bn || "").includes(checkInput))
    );
    setCheckResult(found);
  };

  const getDistrictIcon = (area: CoverageArea) => {
    const dist = getAncestorOfType(area.location_id, "district", locationMap);
    if (dist) return DISTRICT_ICONS[dist.name] || "📍";
    return "📍";
  };

  const getDivisionColor = (area: CoverageArea) => {
    const div = getAncestorOfType(area.location_id, "division", locationMap);
    if (div) return DIVISION_COLORS[div.name] || "border-l-accent";
    return "border-l-accent";
  };

  const getDistrictName = (area: CoverageArea) => {
    const dist = getAncestorOfType(area.location_id, "district", locationMap);
    if (!dist) return null;
    return t(dist.name, dist.name_bn || dist.name);
  };

  return (
    <>

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
            </>
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
                    </>
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
                    </>
                  </>
                )}
              </>
            )}
          </>
        </>
      </section>

      {/* Areas listing */}
      <section className="py-12 bg-secondary/50 flex-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">{t("Covered Areas", "আমাদের সেবা এলাকা")}</h2>
          </>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></>
          ) : (
            <>
              {/* Cascading filters */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-end mb-8 max-w-4xl mx-auto flex-wrap">
                <div className="w-full sm:w-auto">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("Division", "বিভাগ")}</label>
                  <Select value={filterDivision} onValueChange={(v) => { setFilterDivision(v === "all" ? "" : v); setFilterDistrict(""); setFilterThana(""); setFilterZone(""); }}>
                    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder={t("All Divisions", "সকল বিভাগ")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Divisions", "সকল বিভাগ")}</SelectItem>
                      {divisions.map(d => <SelectItem key={d.id} value={d.id}>{t(d.name, d.name_bn || d.name)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </>
                <div className="w-full sm:w-auto">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("District", "জেলা")}</label>
                  <Select value={filterDistrict} onValueChange={(v) => { setFilterDistrict(v === "all" ? "" : v); setFilterThana(""); setFilterZone(""); }} disabled={!filterDivision}>
                    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder={t("All Districts", "সকল জেলা")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Districts", "সকল জেলা")}</SelectItem>
                      {districts.map(d => <SelectItem key={d.id} value={d.id}>{t(d.name, d.name_bn || d.name)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </>
                <div className="w-full sm:w-auto">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("Thana", "থানা")}</label>
                  <Select value={filterThana} onValueChange={(v) => { setFilterThana(v === "all" ? "" : v); setFilterZone(""); }} disabled={!filterDistrict}>
                    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder={t("All Thanas", "সকল থানা")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Thanas", "সকল থানা")}</SelectItem>
                      {thanas.map(t2 => <SelectItem key={t2.id} value={t2.id}>{t(t2.name, t2.name_bn || t2.name)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </>
                <div className="w-full sm:w-auto">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("Zone", "জোন")}</label>
                  <Select value={filterZone} onValueChange={(v) => setFilterZone(v === "all" ? "" : v)} disabled={!filterThana}>
                    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder={t("All Zones", "সকল জোন")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Zones", "সকল জোন")}</SelectItem>
                      {zones.map(z => <SelectItem key={z.id} value={z.id}>{t(z.name, z.name_bn || z.name)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </>
                <div className="relative w-full sm:w-auto">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("Search", "খুঁজুন")}</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t("Search...", "খুঁজুন...")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full sm:w-48" />
                  </>
                </>
              </>

              {/* Grouped area cards */}
              {groupedByDivision.map((group, gi) => (
                <div key={gi} className="mb-8">
                  {group.division && !filterDivision && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px flex-1 bg-border" />
                      <h3 className="text-base font-bold text-foreground whitespace-nowrap">
                        {t(group.division.name + " Division", (group.division.name_bn || group.division.name) + " বিভাগ")}
                      </h3>
                      <Badge variant="secondary" className="text-xs">{group.areas.length}</Badge>
                      <div className="h-px flex-1 bg-border" />
                    </>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {group.areas.map((area) => (
                      <div
                        key={area.id}
                        className={`relative overflow-hidden flex flex-col items-center text-center p-5 rounded-xl bg-background border border-l-4 ${getDivisionColor(area)} hover:shadow-md transition-all group`}
                      >
                        {/* Decorative watermark emoji */}
                        <span className="absolute bottom-1 right-1 text-4xl opacity-[0.08] pointer-events-none select-none group-hover:opacity-[0.15] transition-opacity">
                          {getDistrictIcon(area)}
                        </span>
                        <MapPin className="h-4 w-4 text-accent mb-1.5" />
                        <p className="font-semibold text-foreground text-sm leading-tight">{t(area.name, area.name_bn || area.name)}</p>
                        {getDistrictName(area) && (
                          <span className="mt-1.5 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {getDistrictName(area)}
                          </span>
                        )}
                      </>
                    ))}
                  </>
                </>
              ))}

              {sortedFiltered.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("No areas found", "কোনো এলাকা পাওয়া যায়নি")}</p>
                </>
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
          </>
        </>
      </section>

    </>
  );
};

export default Coverage;
