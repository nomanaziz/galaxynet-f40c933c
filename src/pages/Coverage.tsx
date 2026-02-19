import { useState } from "react";
import { Search, MapPin, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const coveredAreas = [
  { name: "Dhanmondi", nameBn: "ধানমন্ডি", zone: "Dhaka" },
  { name: "Gulshan", nameBn: "গুলশান", zone: "Dhaka" },
  { name: "Banani", nameBn: "বনানী", zone: "Dhaka" },
  { name: "Mirpur", nameBn: "মিরপুর", zone: "Dhaka" },
  { name: "Uttara", nameBn: "উত্তরা", zone: "Dhaka" },
  { name: "Mohammadpur", nameBn: "মোহাম্মদপুর", zone: "Dhaka" },
  { name: "Bashundhara", nameBn: "বসুন্ধরা", zone: "Dhaka" },
  { name: "Badda", nameBn: "বাড্ডা", zone: "Dhaka" },
  { name: "Rampura", nameBn: "রামপুরা", zone: "Dhaka" },
  { name: "Tejgaon", nameBn: "তেজগাঁও", zone: "Dhaka" },
  { name: "Motijheel", nameBn: "মতিঝিল", zone: "Dhaka" },
  { name: "Khilgaon", nameBn: "খিলগাঁও", zone: "Dhaka" },
  { name: "Agrabad", nameBn: "আগ্রাবাদ", zone: "Chittagong" },
  { name: "Nasirabad", nameBn: "নাসিরাবাদ", zone: "Chittagong" },
  { name: "Panchlaish", nameBn: "পাঁচলাইশ", zone: "Chittagong" },
  { name: "Halishahar", nameBn: "হালিশহর", zone: "Chittagong" },
  { name: "Sylhet Sadar", nameBn: "সিলেট সদর", zone: "Sylhet" },
  { name: "Zindabazar", nameBn: "জিন্দাবাজার", zone: "Sylhet" },
  { name: "Gazipur Sadar", nameBn: "গাজীপুর সদর", zone: "Gazipur" },
  { name: "Tongi", nameBn: "টঙ্গী", zone: "Gazipur" },
];

const zones = ["All", "Dhaka", "Chittagong", "Sylhet", "Gazipur"];

const Coverage = () => {
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState("All");
  const [checkResult, setCheckResult] = useState<null | boolean>(null);
  const [checkInput, setCheckInput] = useState("");

  const filtered = coveredAreas.filter((area) => {
    const matchesZone = selectedZone === "All" || area.zone === selectedZone;
    const matchesSearch =
      search === "" ||
      area.name.toLowerCase().includes(search.toLowerCase()) ||
      area.nameBn.includes(search) ||
      area.zone.toLowerCase().includes(search.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const handleCheck = () => {
    if (!checkInput.trim()) return;
    const found = coveredAreas.some(
      (area) =>
        area.name.toLowerCase().includes(checkInput.toLowerCase()) ||
        area.nameBn.includes(checkInput)
    );
    setCheckResult(found);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-white blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Coverage Area</h1>
          <p className="text-2xl font-semibold text-orange-300 mb-4">কভারেজ এলাকা</p>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            We're expanding across Bangladesh. Check if Galaxy Net is available in your area!
          </p>
          <p className="text-blue-300 text-sm mt-2 max-w-xl mx-auto">
            আমরা সারা বাংলাদেশে বিস্তার লাভ করছি। আপনার এলাকায় গ্যালাক্সি নেট আছে কিনা চেক করুন!
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" className="fill-background w-full h-12 md:h-16">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Check Your Area */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="p-6 rounded-2xl border-2 border-galaxy-orange/30 bg-galaxy-orange/5">
              <h2 className="text-xl font-bold text-galaxy-blue mb-1 text-center">Check Your Area</h2>
              <p className="text-center text-galaxy-orange font-medium text-sm mb-4">আপনার এলাকা চেক করুন</p>
              <div className="flex gap-3">
                <Input
                  placeholder="Type your area name... · এলাকার নাম লিখুন..."
                  value={checkInput}
                  onChange={(e) => {
                    setCheckInput(e.target.value);
                    setCheckResult(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  className="border-2 border-galaxy-blue/20 focus-visible:ring-galaxy-orange"
                />
                <Button onClick={handleCheck} className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-semibold shrink-0">
                  <Search className="h-4 w-4 mr-1" /> Check
                </Button>
              </div>
              {checkResult !== null && (
                <div className={`mt-4 flex items-center gap-3 p-4 rounded-lg ${checkResult ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
                  {checkResult ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-green-700">Great news! We cover your area. · দারুণ খবর! আমরা আপনার এলাকায় আছি।</p>
                        <p className="text-sm text-green-600">Contact us to get connected today!</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                      <div>
                        <p className="font-semibold text-red-700">Not available yet. · এখনো পাওয়া যাচ্ছে না।</p>
                        <p className="text-sm text-red-600">We're expanding! Contact us to register your interest.</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Area List */}
      <section className="py-12 bg-secondary flex-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-galaxy-blue mb-2">Covered Areas</h2>
            <p className="text-xl font-semibold text-galaxy-orange">আমাদের সেবা এলাকা</p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                  selectedZone === zone
                    ? "bg-galaxy-blue text-white border-galaxy-blue"
                    : "bg-background text-galaxy-blue border-galaxy-blue/30 hover:border-galaxy-blue"
                }`}
              >
                {zone}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-sm mx-auto mb-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search areas... · এলাকা খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-2 border-galaxy-blue/20"
            />
          </div>

          {/* Area Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((area) => (
              <div
                key={area.name}
                className="flex flex-col items-center text-center p-4 rounded-xl bg-background border-2 border-border hover:border-galaxy-orange hover:shadow-md transition-all"
              >
                <MapPin className="h-5 w-5 text-galaxy-orange mb-2" />
                <p className="font-semibold text-galaxy-blue text-sm">{area.name}</p>
                <p className="text-xs text-muted-foreground">{area.nameBn}</p>
                <Badge className="mt-2 text-xs bg-galaxy-blue/10 text-galaxy-blue border-0">
                  {area.zone}
                </Badge>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No areas found · কোনো এলাকা পাওয়া যায়নি</p>
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">
              Don't see your area? · আপনার এলাকা নেই?{" "}
              <a href="/contact" className="text-galaxy-orange font-semibold hover:underline">
                Contact us · যোগাযোগ করুন
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Coverage;
