import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Wifi, Zap, Shield, BadgeCheck, Home, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { buildLocationMap, isAncestorDisabled, type CoverageLocation } from "@/lib/coverageHierarchy";

const NewConnection = () => {
  const [locations, setLocations] = useState<CoverageLocation[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [packageId, setPackageId] = useState("");
  const [activeCategory, setActiveCategory] = useState("home");
  const [dedicatedMbps, setDedicatedMbps] = useState("");

  // Hierarchical area states
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedThana, setSelectedThana] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [thanaSearch, setThanaSearch] = useState("");

  useEffect(() => {
    supabase.from("coverage_locations").select("*").order("sort_order").order("name").then(({ data }) => {
      setLocations((data as CoverageLocation[]) ?? []);
    });
    supabase.from("packages").select("*").eq("visible", true).order("sort_order").then(({ data }) => setPackages(data ?? []));
  }, []);

  const locationMap = useMemo(() => buildLocationMap(locations), [locations]);

  // Filter to only effectively enabled locations
  const enabledLocations = useMemo(() => {
    return locations.filter(l => l.enabled && !isAncestorDisabled(l.id, locationMap));
  }, [locations, locationMap]);

  const divisions = useMemo(() => enabledLocations.filter(l => l.type === "division"), [enabledLocations]);
  
  const districts = useMemo(() => {
    if (!selectedDivision) return [];
    return enabledLocations
      .filter(l => l.type === "district" && l.parent_id === selectedDivision)
      .filter(l => {
        if (!districtSearch) return true;
        const s = districtSearch.toLowerCase();
        return l.name.toLowerCase().includes(s) || (l.name_bn || "").includes(s);
      });
  }, [enabledLocations, selectedDivision, districtSearch]);

  const thanas = useMemo(() => {
    if (!selectedDistrict) return [];
    return enabledLocations
      .filter(l => l.type === "thana" && l.parent_id === selectedDistrict)
      .filter(l => {
        if (!thanaSearch) return true;
        const s = thanaSearch.toLowerCase();
        return l.name.toLowerCase().includes(s) || (l.name_bn || "").includes(s);
      });
  }, [enabledLocations, selectedDistrict, thanaSearch]);

  // Auto-select if only one division
  useEffect(() => {
    if (divisions.length === 1 && !selectedDivision) {
      setSelectedDivision(divisions[0].id);
    }
  }, [divisions, selectedDivision]);

  // Get the area name for submission
  const getAreaName = () => {
    if (selectedThana) {
      const t = locationMap.get(selectedThana);
      return t?.name || "";
    }
    if (selectedDistrict) {
      const d = locationMap.get(selectedDistrict);
      return d?.name || "";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const areaName = getAreaName();
    if (!name.trim() || !phone.trim() || !areaName) {
      toast({ title: "অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন", variant: "destructive" });
      return;
    }
    if (phone.replace(/[^0-9]/g, "").length < 11) {
      toast({ title: "সঠিক ফোন নাম্বার দিন (১১ ডিজিট)", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const notesData: any = { source: "landing_page" };
    if (activeCategory === "dedicated") {
      notesData.dedicated_mbps = dedicatedMbps;
    }
    const { error } = await supabase.from("connection_orders").insert({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || "N/A",
      area: areaName,
      package_id: activeCategory !== "dedicated" ? (packageId || null) : null,
      notes: JSON.stringify(notesData),
    });

    setSubmitting(false);
    if (error) {
      toast({ title: "সমস্যা হয়েছে, আবার চেষ্টা করুন", variant: "destructive" });
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(215,60%,8%)] to-[hsl(195,75%,22%)] px-4">
        <div className="bg-white rounded-2xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">ধন্যবাদ!</h2>
          <p className="text-muted-foreground mb-6">আপনার আবেদন সফলভাবে জমা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।</p>
          <Button onClick={() => setSuccess(false)} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            আরেকটি আবেদন করুন
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(215,60%,8%)] via-[hsl(215,60%,12%)] to-[hsl(195,75%,22%)]">
      {/* Minimal Header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Galaxy Net" className="h-10 brightness-0 invert" />
        </Link>
        <Link to="/" className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors">
          <Home className="h-4 w-4 text-accent" />
          <span>হোমপেজ</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-lg mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">নতুন কানেকশনের জন্য আবেদন করুন</h1>
            <p className="text-white/60 text-sm">নিচের ফর্মটি পূরণ করুন, আমরা শীঘ্রই যোগাযোগ করবো</p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Zap className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
              <span className="text-white/90 text-xs font-medium">লাইটনিং ফাস্ট স্পিড</span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Shield className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <span className="text-white/90 text-xs font-medium">২৪/৭ সাপোর্ট</span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <BadgeCheck className="h-5 w-5 text-accent mx-auto mb-1" />
              <span className="text-white/90 text-xs font-medium">সাশ্রয়ী মূল্য</span>
            </div>
          </div>
          <p className="text-center text-white/50 text-xs mb-6">১০,০০০+ সন্তুষ্ট গ্রাহক আমাদের উপর আস্থা রাখেন</p>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl space-y-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">আপনার নাম <span className="text-red-500">*</span></Label>
              <Input placeholder="সম্পূর্ণ নাম লিখুন" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            {/* Hierarchical Area Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">এলাকা নির্বাচন করুন <span className="text-red-500">*</span></Label>
              
              {/* Division */}
              <Select value={selectedDivision} onValueChange={(v) => { setSelectedDivision(v); setSelectedDistrict(""); setSelectedThana(""); setDistrictSearch(""); setThanaSearch(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="বিভাগ বাছাই করুন" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name_bn || d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* District with search */}
              {selectedDivision && (
                <div className="space-y-1.5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="জেলা খুঁজুন..."
                      value={districtSearch}
                      onChange={(e) => setDistrictSearch(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                  <Select value={selectedDistrict} onValueChange={(v) => { setSelectedDistrict(v); setSelectedThana(""); setThanaSearch(""); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="জেলা বাছাই করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.name_bn || d.name}</SelectItem>
                      ))}
                      {districts.length === 0 && (
                        <div className="py-2 px-3 text-sm text-muted-foreground text-center">কোনো জেলা পাওয়া যায়নি</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Thana with search */}
              {selectedDistrict && thanas.length > 0 && (
                <div className="space-y-1.5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="থানা/উপজেলা খুঁজুন..."
                      value={thanaSearch}
                      onChange={(e) => setThanaSearch(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                  <Select value={selectedThana} onValueChange={setSelectedThana}>
                    <SelectTrigger>
                      <SelectValue placeholder="থানা/উপজেলা বাছাই করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {thanas.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name_bn || t.name}</SelectItem>
                      ))}
                      {thanas.length === 0 && (
                        <div className="py-2 px-3 text-sm text-muted-foreground text-center">কোনো থানা পাওয়া যায়নি</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">আপনার ঠিকানা</Label>
              <Input placeholder="বাসা নং / রোড নং" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">ফোন নাম্বার <span className="text-red-500">*</span></Label>
              <Input placeholder="01XXXXXXXXX" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={15} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">প্যাকেজ নির্বাচন করুন</Label>
              <Tabs value={activeCategory} onValueChange={(v) => { setActiveCategory(v); setPackageId(""); }}>
                <TabsList className="w-full">
                  <TabsTrigger value="home" className="flex-1">হোম</TabsTrigger>
                  <TabsTrigger value="corporate" className="flex-1">কর্পোরেট</TabsTrigger>
                  <TabsTrigger value="dedicated" className="flex-1">ডেডিকেটেড</TabsTrigger>
                </TabsList>
                <TabsContent value="home">
                  <Select value={packageId} onValueChange={setPackageId}>
                    <SelectTrigger><SelectValue placeholder="প্যাকেজ বাছাই করুন" /></SelectTrigger>
                    <SelectContent>
                      {packages.filter(p => p.category === "home").map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.speed >= 1000 ? `${p.speed / 1000}Gbps` : `${p.speed}Mbps`} @ ৳{p.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>
                <TabsContent value="corporate">
                  <Select value={packageId} onValueChange={setPackageId}>
                    <SelectTrigger><SelectValue placeholder="প্যাকেজ বাছাই করুন" /></SelectTrigger>
                    <SelectContent>
                      {packages.filter(p => p.category === "corporate").map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.speed >= 1000 ? `${p.speed / 1000}Gbps` : `${p.speed}Mbps`} @ ৳{p.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>
                <TabsContent value="dedicated">
                  <Input
                    type="number"
                    placeholder="আপনার প্রয়োজনীয় Mbps লিখুন (যেমন: 100)"
                    value={dedicatedMbps}
                    onChange={(e) => setDedicatedMbps(e.target.value)}
                    min={1}
                    required
                  />
                </TabsContent>
              </Tabs>
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base py-6">
              {submitting ? "জমা হচ্ছে..." : "ফর্ম সাবমিট করুন"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              আপনার তথ্য সম্পূর্ণ নিরাপদ এবং গোপনীয়
            </p>
          </form>

          {/* Why Galaxy Net */}
          <div className="mt-8 text-center space-y-3">
            <h3 className="text-white font-semibold text-lg">কেন Galaxy Net?</h3>
            <div className="space-y-2 text-white/70 text-sm">
              <p>✅ ফাইবার অপটিক কানেকশন — সর্বোচ্চ গতি নিশ্চিত</p>
              <p>✅ ক্যাশ সার্ভার সুবিধা — বাফারিং ছাড়া স্ট্রিমিং</p>
              <p>✅ দ্রুত ইনস্টলেশন — আবেদনের ২৪ ঘণ্টার মধ্যে সংযোগ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewConnection;
