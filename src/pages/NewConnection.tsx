import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Wifi, Zap, Shield, BadgeCheck, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildLocationMap, isAncestorDisabled, type CoverageLocation } from "@/lib/coverageHierarchy";
import PageHeroDark from "@/components/PageHeroDark";

const NewConnection = () => {
  const [locations, setLocations] = useState<CoverageLocation[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [packageId, setPackageId] = useState("");
  const [activeCategory, setActiveCategory] = useState("home");
  const [dedicatedMbps, setDedicatedMbps] = useState("");

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
  const enabledLocations = useMemo(() => locations.filter(l => l.enabled && !isAncestorDisabled(l.id, locationMap)), [locations, locationMap]);
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

  useEffect(() => {
    if (divisions.length === 1 && !selectedDivision) {
      setSelectedDivision(divisions[0].id);
    }
  }, [divisions, selectedDivision]);

  const getAreaName = () => {
    if (selectedThana) return locationMap.get(selectedThana)?.name || "";
    if (selectedDistrict) return locationMap.get(selectedDistrict)?.name || "";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const areaName = getAreaName();
    if (!name.trim() || !phone.trim() || !areaName) {
      toast({ title: t("Please fill in the required fields", "অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন"), variant: "destructive" });
      return;
    }
    if (phone.replace(/[^0-9]/g, "").length < 11) {
      toast({ title: t("Enter a valid phone number (11 digits)", "সঠিক ফোন নাম্বার দিন (১১ ডিজিট)"), variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const notesData: any = { source: "new_connection_page" };
    if (activeCategory === "dedicated") notesData.dedicated_mbps = dedicatedMbps;
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
      toast({ title: t("Something went wrong, please try again", "সমস্যা হয়েছে, আবার চেষ্টা করুন"), variant: "destructive" });
    } else {
      // Fire-and-forget Telegram notification
      const selectedPkg = packages.find((p) => p.id === packageId);
      const packageLabel = selectedPkg
        ? `${selectedPkg.speed >= 1000 ? `${selectedPkg.speed / 1000}Gbps` : `${selectedPkg.speed}Mbps`} @ ৳${selectedPkg.price}`
        : "";
      supabase.functions
        .invoke("notify-order-telegram", {
          body: {
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim() || "N/A",
            area: areaName,
            category: activeCategory,
            packageLabel,
            dedicatedMbps: activeCategory === "dedicated" ? dedicatedMbps : "",
          },
        })
        .catch((e) => console.error("Telegram notify failed", e));
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <>
        <PageHeroDark
          title="New Connection"
          titleBn="নতুন সংযোগ"
          bgImage="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80"
        />
        <section className="flex-1 flex items-center justify-center py-16 bg-background">
          <div className="bg-card rounded-2xl p-8 md:p-12 max-w-md w-full text-center shadow-xl border mx-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{t("Thank you!", "ধন্যবাদ!")}</h2>
            <p className="text-muted-foreground mb-6">{t("Your application has been submitted successfully. We will contact you soon.", "আপনার আবেদন সফলভাবে জমা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।")}</p>
            <Button onClick={() => setSuccess(false)} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              {t("Submit another application", "আরেকটি আবেদন করুন")}
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeroDark
        title="New Connection"
        titleBn="নতুন সংযোগ"
        subtitle="Apply for a new internet connection"
        subtitleBn="নতুন ইন্টারনেট সংযোগের জন্য আবেদন করুন"
        bgImage="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80"
      />

      <section className="py-8 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 md:p-4 text-center">
                <Zap className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                <span className="text-foreground text-xs font-medium">{t("Lightning Fast", "লাইটনিং ফাস্ট স্পিড")}</span>
              </div>
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 md:p-4 text-center">
                <Shield className="h-5 w-5 text-green-500 mx-auto mb-1" />
                <span className="text-foreground text-xs font-medium">{t("24/7 Support", "২৪/৭ সাপোর্ট")}</span>
              </div>
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 md:p-4 text-center">
                <BadgeCheck className="h-5 w-5 text-accent mx-auto mb-1" />
                <span className="text-foreground text-xs font-medium">{t("Affordable", "সাশ্রয়ী মূল্য")}</span>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-2xl p-5 md:p-8 shadow-lg border">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">{t("Apply for New Connection", "নতুন কানেকশনের জন্য আবেদন করুন")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("Fill in the form below and we'll contact you soon", "নিচের ফর্মটি পূরণ করুন, আমরা শীঘ্রই যোগাযোগ করবো")}</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">{t("Your Name", "আপনার নাম")} <span className="text-red-500">*</span></Label>
                  <Input placeholder={t("Full name", "সম্পূর্ণ নাম লিখুন")} value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                {/* Hierarchical Area Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">{t("Select Area", "এলাকা নির্বাচন করুন")} <span className="text-red-500">*</span></Label>

                  <Select
                    key={`div-${locations.length}`}
                    value={selectedDivision || undefined}
                    onValueChange={(v) => {
                      setSelectedDivision(v);
                      setSelectedDistrict("");
                      setSelectedThana("");
                      setDistrictSearch("");
                      setThanaSearch("");
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder={t("Select Division", "বিভাগ বাছাই করুন")} /></SelectTrigger>
                    <SelectContent>
                      {divisions.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.name_bn || d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedDivision && (
                    <div className="space-y-1.5">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder={t("Search district...", "জেলা খুঁজুন...")} value={districtSearch} onChange={(e) => setDistrictSearch(e.target.value)} className="pl-9 h-9 text-sm" />
                      </div>
                      <Select
                        key={`dist-${selectedDivision}`}
                        value={selectedDistrict || undefined}
                        onValueChange={(v) => {
                          setSelectedDistrict(v);
                          setSelectedThana("");
                          setThanaSearch("");
                        }}
                      >
                        <SelectTrigger><SelectValue placeholder={t("Select District", "জেলা বাছাই করুন")} /></SelectTrigger>
                        <SelectContent>
                          {districts.length === 0 ? (
                            <SelectItem value="__none__" disabled>{t("No districts found", "কোনো জেলা পাওয়া যায়নি")}</SelectItem>
                          ) : (
                            districts.map((d) => (
                              <SelectItem key={d.id} value={d.id}>{d.name_bn || d.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedDistrict && thanas.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder={t("Search thana...", "থানা/উপজেলা খুঁজুন...")} value={thanaSearch} onChange={(e) => setThanaSearch(e.target.value)} className="pl-9 h-9 text-sm" />
                      </div>
                      <Select
                        key={`thana-${selectedDistrict}`}
                        value={selectedThana || undefined}
                        onValueChange={setSelectedThana}
                      >
                        <SelectTrigger><SelectValue placeholder={t("Select Thana", "থানা/উপজেলা বাছাই করুন")} /></SelectTrigger>
                        <SelectContent>
                          {thanas.map((th) => (
                            <SelectItem key={th.id} value={th.id}>{th.name_bn || th.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">{t("Your Address", "আপনার ঠিকানা")}</Label>
                  <Input placeholder={t("House/Road no.", "বাসা নং / রোড নং")} value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">{t("Phone Number", "ফোন নাম্বার")} <span className="text-red-500">*</span></Label>
                  <Input placeholder="01XXXXXXXXX" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={15} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">{t("Select Package", "প্যাকেজ নির্বাচন করুন")}</Label>
                  <Tabs value={activeCategory} onValueChange={(v) => { setActiveCategory(v); setPackageId(""); }}>
                    <TabsList className="w-full">
                      <TabsTrigger value="home" className="flex-1">{t("Home", "হোম")}</TabsTrigger>
                      <TabsTrigger value="corporate" className="flex-1">{t("Corporate", "কর্পোরেট")}</TabsTrigger>
                      <TabsTrigger value="dedicated" className="flex-1">{t("Dedicated", "ডেডিকেটেড")}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="home">
                      <Select value={packageId} onValueChange={setPackageId}>
                        <SelectTrigger><SelectValue placeholder={t("Choose a package", "প্যাকেজ বাছাই করুন")} /></SelectTrigger>
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
                        <SelectTrigger><SelectValue placeholder={t("Choose a package", "প্যাকেজ বাছাই করুন")} /></SelectTrigger>
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
                        placeholder={t("Enter required Mbps (e.g. 100)", "আপনার প্রয়োজনীয় Mbps লিখুন (যেমন: 100)")}
                        value={dedicatedMbps}
                        onChange={(e) => setDedicatedMbps(e.target.value)}
                        min={1}
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                <Button type="submit" disabled={submitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base py-6">
                  {submitting ? t("Submitting...", "জমা হচ্ছে...") : t("Submit Application", "ফর্ম সাবমিট করুন")}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  {t("Your information is completely safe and confidential", "আপনার তথ্য সম্পূর্ণ নিরাপদ এবং গোপনীয়")}
                </p>
              </form>
            </div>

            {/* Why Galaxy Net */}
            <div className="mt-8 text-center space-y-3">
              <h3 className="text-foreground font-semibold text-lg">{t("Why Galaxy Net?", "কেন Galaxy Net?")}</h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <p>✅ {t("Fiber Optic Connection — Maximum speed guaranteed", "ফাইবার অপটিক কানেকশন — সর্বোচ্চ গতি নিশ্চিত")}</p>
                <p>✅ {t("Cache Server — Streaming without buffering", "ক্যাশ সার্ভার সুবিধা — বাফারিং ছাড়া স্ট্রিমিং")}</p>
                <p>✅ {t("Quick Installation — Connection within 24 hours", "দ্রুত ইনস্টলেশন — আবেদনের ২৪ ঘণ্টার মধ্যে সংযোগ")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewConnection;
