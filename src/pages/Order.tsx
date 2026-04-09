import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, ArrowRight, ArrowLeft, User, Phone, MapPin, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  { label: "Personal Info", labelBn: "ব্যক্তিগত তথ্য", icon: User },
  { label: "Address", labelBn: "ঠিকানা", icon: MapPin },
  { label: "Package", labelBn: "প্যাকেজ", icon: Package },
  { label: "Confirm", labelBn: "নিশ্চিত করুন", icon: CheckCircle },
];

const Order = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "", mobile: "", email: "", address: "", area: "",
    package_id: "", package_label: "", date: undefined as Date | undefined, notes: "",
  });

  useEffect(() => {
    supabase.from("packages").select("*").eq("visible", true).order("sort_order").then(({ data }) => setPackages(data ?? []));
  }, []);

  const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 0) return form.name.trim() && form.mobile.trim();
    if (step === 1) return form.address.trim() && form.area.trim();
    if (step === 2) return !!form.package_id;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("connection_orders").insert({
      name: form.name, phone: form.mobile, email: form.email || null,
      address: form.address, area: form.area, package_id: form.package_id || null,
      preferred_date: form.date ? format(form.date, "yyyy-MM-dd") : null,
      notes: form.notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: t("Error", "ত্রুটি"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("Order Submitted!", "অর্ডার জমা হয়েছে!"), description: t("We will contact you within 24 hours.", "আমরা ২৪ ঘণ্টার মধ্যে যোগাযোগ করব।") });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <>
        
        <section className="flex-1 flex items-center justify-center py-20 bg-background">
          <Card className="max-w-md w-full mx-4 border-2 border-accent/30">
            <CardContent className="p-8 text-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("Order Received!", "অর্ডার গৃহীত হয়েছে!")}</h2>
              <p className="text-muted-foreground mb-2">{t(`Thank you, ${form.name}. We will contact you at ${form.mobile} within 24 hours.`, `ধন্যবাদ, ${form.name}। আমরা ২৪ ঘণ্টার মধ্যে ${form.mobile} নম্বরে যোগাযোগ করব।`)}</p>
            </CardContent>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      

      <section className="page-hero">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{t("Order Connection", "নতুন সংযোগের আবেদন")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t("Fill out the form and we'll get you connected!", "ফর্ম পূরণ করুন, আমরা আপনাকে সংযুক্ত করব!")}
          </p>
        </>
      </section>

      <section className="py-12 md:py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center flex-1">
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all", i <= step ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground")}>
                  <s.icon className="h-5 w-5" />
                </>
                <p className={cn("text-xs mt-1 font-medium hidden sm:block", i <= step ? "text-accent" : "text-muted-foreground")}>
                  {t(s.label, s.labelBn)}
                </p>
              </>
            ))}
          </>

          <Card className="border-2">
            <CardContent className="p-6 md:p-8">
              {step === 0 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-foreground">{t("Personal Information", "ব্যক্তিগত তথ্য")}</h3>
                  <div><Label>{t("Full Name", "পূর্ণ নাম")} *</Label><Input placeholder={t("Your name...", "আপনার নাম...")} value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-1" /></>
                  <div><Label>{t("Mobile Number", "মোবাইল নম্বর")} *</Label><Input type="tel" placeholder="01XXXXXXXXX" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} className="mt-1" /></>
                  <div><Label>{t("Email (Optional)", "ইমেইল")}</Label><Input type="email" placeholder="email@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-1" /></>
                </>
              )}
              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-foreground">{t("Address", "ঠিকানা")}</h3>
                  <div><Label>{t("Full Address", "সম্পূর্ণ ঠিকানা")} *</Label><Textarea placeholder="House/Flat, Road..." value={form.address} onChange={(e) => update("address", e.target.value)} className="mt-1" /></>
                  <div><Label>{t("Area", "এলাকা")} *</Label><Input placeholder="e.g. Dhanmondi, Gulshan..." value={form.area} onChange={(e) => update("area", e.target.value)} className="mt-1" /></>
                </>
              )}
              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-foreground">{t("Select Package", "প্যাকেজ নির্বাচন")}</h3>
                  <div>
                    <Label>{t("Internet Package", "ইন্টারনেট প্যাকেজ")} *</Label>
                    <Select value={form.package_id} onValueChange={(v) => { const pkg = packages.find(p => p.id === v); update("package_id", v); update("package_label", pkg ? `${pkg.name} — ${pkg.speed} Mbps — ৳${pkg.price}` : v); }}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder={t("Choose a package", "প্যাকেজ বাছাই করুন")} /></SelectTrigger>
                      <SelectContent>
                        {packages.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name} — {p.speed} Mbps — ৳{p.price}/mo</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                  <div>
                    <Label>{t("Preferred Date", "পছন্দের তারিখ")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full mt-1 justify-start text-left font-normal", !form.date && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.date ? format(form.date, "PPP") : t("Pick a date", "তারিখ বাছুন")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={form.date} onSelect={(d) => update("date", d)} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </>
                  <div><Label>{t("Notes", "অতিরিক্ত তথ্য")}</Label><Textarea placeholder={t("Any special instructions...", "বিশেষ নির্দেশনা...")} value={form.notes} onChange={(e) => update("notes", e.target.value)} className="mt-1" /></>
                </>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">{t("Confirm Order", "অর্ডার নিশ্চিত করুন")}</h3>
                  <div className="p-4 rounded-lg bg-secondary space-y-2 text-sm">
                    <p><strong>{t("Name", "নাম")}:</strong> {form.name}</p>
                    <p><strong>{t("Mobile", "মোবাইল")}:</strong> {form.mobile}</p>
                    {form.email && <p><strong>{t("Email", "ইমেইল")}:</strong> {form.email}</p>}
                    <p><strong>{t("Address", "ঠিকানা")}:</strong> {form.address}</p>
                    <p><strong>{t("Area", "এলাকা")}:</strong> {form.area}</p>
                    <p><strong>{t("Package", "প্যাকেজ")}:</strong> {form.package_label}</p>
                    {form.date && <p><strong>{t("Date", "তারিখ")}:</strong> {format(form.date, "PPP")}</p>}
                  </>
                </>
              )}

              <div className="flex justify-between mt-8">
                {step > 0 ? <Button variant="outline" onClick={() => setStep(step - 1)}><ArrowLeft className="mr-2 h-4 w-4" /> {t("Back", "পেছনে")}</Button> : <div />}
                {step < 3 ? (
                  <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    {t("Next", "পরবর্তী")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    {t("Submit Order", "অর্ডার করুন")}
                  </Button>
                )}
              </>
            </CardContent>
          </Card>
        </>
      </section>

    </>
  );
};

export default Order;
