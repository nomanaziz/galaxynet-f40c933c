import { useState, useEffect } from "react";
import { CheckCircle, Loader2, Wifi, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const GetConnected = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [packages, setPackages] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", mobile: "", area: "", address: "", package_id: "", payment: "mobile_banking",
  });

  useEffect(() => {
    supabase.from("packages").select("*").eq("visible", true).order("sort_order").then(({ data }) => setPackages(data ?? []));
  }, []);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.area || !form.address) return;
    setSubmitting(true);
    const { error } = await supabase.from("connection_orders").insert({
      name: form.name, phone: form.mobile, area: form.area, address: form.address,
      package_id: form.package_id || null, notes: `Payment: ${form.payment}`,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: t("Error", "ত্রুটি"), description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar /><Navbar />
        <section className="flex-1 flex items-center justify-center py-20 bg-background">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("Request Received!", "আবেদন গৃহীত!")}</h2>
              <p className="text-muted-foreground">{t("Our team will contact you shortly.", "আমাদের টিম শীঘ্রই যোগাযোগ করবে।")}</p>
            </CardContent>
          </Card>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar /><Navbar />

      <section className="hero-gradient-soft relative overflow-hidden py-16">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Wifi className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">{t("Get Connected Today", "আজই সংযুক্ত হন")}</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {t("Fill out the form below and our team will reach out to set up your connection.", "নিচের ফর্ম পূরণ করুন, আমাদের টিম আপনার সংযোগ সেটআপ করবে।")}
          </p>
        </div>
      </section>

      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="border-2">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div><Label>{t("Name", "নাম")} *</Label><Input required value={form.name} onChange={e => update("name", e.target.value)} className="mt-1" /></div>
                <div><Label>{t("Mobile", "মোবাইল")} *</Label><Input required type="tel" placeholder="01XXXXXXXXX" value={form.mobile} onChange={e => update("mobile", e.target.value)} className="mt-1" /></div>
                <div><Label>{t("Area", "এলাকা")} *</Label><Input required value={form.area} onChange={e => update("area", e.target.value)} className="mt-1" /></div>
                <div><Label>{t("Address", "ঠিকানা")} *</Label><Input required value={form.address} onChange={e => update("address", e.target.value)} className="mt-1" /></div>
                <div>
                  <Label>{t("Select Package", "প্যাকেজ নির্বাচন")}</Label>
                  <Select value={form.package_id} onValueChange={v => update("package_id", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder={t("Choose...", "বাছাই করুন...")} /></SelectTrigger>
                    <SelectContent>
                      {packages.map(p => <SelectItem key={p.id} value={p.id}>{p.name} — {p.speed} Mbps — ৳{p.price}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">{t("Payment Option", "পেমেন্ট অপশন")}</Label>
                  <RadioGroup value={form.payment} onValueChange={v => update("payment", v)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile_banking" id="mb" />
                      <Label htmlFor="mb" className="font-normal">{t("Mobile Banking", "মোবাইল ব্যাংকিং")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="font-normal">{t("Cash after service", "সেবার পর ক্যাশ")}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" size="lg">
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                  {t("Submit Request", "আবেদন জমা দিন")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GetConnected;
