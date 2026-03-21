import { useState } from "react";
import { Search, MapPin, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const coveredAreas = [
  { name: "Dhanmondi", nameBn: "ধানমন্ডি", zone: "Dhaka", district: "Dhaka" },
  { name: "Gulshan", nameBn: "গুলশান", zone: "Dhaka", district: "Dhaka" },
  { name: "Banani", nameBn: "বনানী", zone: "Dhaka", district: "Dhaka" },
  { name: "Mirpur", nameBn: "মিরপুর", zone: "Dhaka", district: "Dhaka" },
  { name: "Uttara", nameBn: "উত্তরা", zone: "Dhaka", district: "Dhaka" },
  { name: "Mohammadpur", nameBn: "মোহাম্মদপুর", zone: "Dhaka", district: "Dhaka" },
  { name: "Bashundhara", nameBn: "বসুন্ধরা", zone: "Dhaka", district: "Dhaka" },
  { name: "Badda", nameBn: "বাড্ডা", zone: "Dhaka", district: "Dhaka" },
  { name: "Rampura", nameBn: "রামপুরা", zone: "Dhaka", district: "Dhaka" },
  { name: "Tejgaon", nameBn: "তেজগাঁও", zone: "Dhaka", district: "Dhaka" },
  { name: "Motijheel", nameBn: "মতিঝিল", zone: "Dhaka", district: "Dhaka" },
  { name: "Khilgaon", nameBn: "খিলগাঁও", zone: "Dhaka", district: "Dhaka" },
  { name: "Agrabad", nameBn: "আগ্রাবাদ", zone: "Chittagong", district: "Chittagong" },
  { name: "Nasirabad", nameBn: "নাসিরাবাদ", zone: "Chittagong", district: "Chittagong" },
  { name: "Panchlaish", nameBn: "পাঁচলাইশ", zone: "Chittagong", district: "Chittagong" },
  { name: "Halishahar", nameBn: "হালিশহর", zone: "Chittagong", district: "Chittagong" },
  { name: "Sylhet Sadar", nameBn: "সিলেট সদর", zone: "Sylhet", district: "Sylhet" },
  { name: "Zindabazar", nameBn: "জিন্দাবাজার", zone: "Sylhet", district: "Sylhet" },
  { name: "Gazipur Sadar", nameBn: "গাজীপুর সদর", zone: "Gazipur", district: "Gazipur" },
  { name: "Tongi", nameBn: "টঙ্গী", zone: "Gazipur", district: "Gazipur" },
];

const zones = ["All", "Dhaka", "Chittagong", "Sylhet", "Gazipur"];

const Coverage = () => {
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState("All");
  const [checkResult, setCheckResult] = useState<null | boolean>(null);
  const [checkInput, setCheckInput] = useState("");
  const { t } = useLanguage();

  const filtered = coveredAreas.filter((area) => {
    const matchesZone = selectedZone === "All" || area.zone === selectedZone;
    const matchesSearch = search === "" || area.name.toLowerCase().includes(search.toLowerCase()) || area.nameBn.includes(search);
    return matchesZone && matchesSearch;
  });

  const handleCheck = () => {
    if (!checkInput.trim()) return;
    const found = coveredAreas.some(
      (area) => area.name.toLowerCase().includes(checkInput.toLowerCase()) || area.nameBn.includes(checkInput)
    );
    setCheckResult(found);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="page-hero">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{t("Coverage Area", "কভারেজ এলাকা")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t("Check if Galaxy Net is available in your area", "আপনার এলাকায় গ্যালাক্সি নেট আছে কিনা দেখুন")}
          </p>
        </div>
      </section>

      {/* Check Area */}
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

      {/* Area List */}
      <section className="py-12 bg-secondary/50 flex-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">{t("Covered Areas", "আমাদের সেবা এলাকা")}</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex flex-wrap gap-2">
              {zones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    selectedZone === zone
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/40"
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
              <div key={area.name} className="flex flex-col items-center text-center p-4 rounded-xl bg-background border hover:border-accent/40 hover:shadow-sm transition-all">
                <MapPin className="h-5 w-5 text-accent mb-2" />
                <p className="font-medium text-foreground text-sm">{t(area.name, area.nameBn)}</p>
                <Badge variant="secondary" className="mt-2 text-xs">{area.zone}</Badge>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{t("No areas found", "কোনো এলাকা পাওয়া যায়নি")}</p>
            </div>
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
