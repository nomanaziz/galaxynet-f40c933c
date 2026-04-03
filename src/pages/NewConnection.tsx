import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Wifi, Zap, Shield, BadgeCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const NewConnection = () => {
  const [areas, setAreas] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    supabase.from("coverage_locations").select("id, name, name_bn").order("name").then(({ data }) => setAreas(data ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !area) {
      toast({ title: "অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন", variant: "destructive" });
      return;
    }
    if (phone.replace(/[^0-9]/g, "").length < 11) {
      toast({ title: "সঠিক ফোন নাম্বার দিন (১১ ডিজিট)", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("connection_orders").insert({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || "N/A",
      area,
      notes: JSON.stringify({ source: "landing_page" }),
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
        <img src={logo} alt="Galaxy Net" className="h-10 brightness-0 invert" />
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <Wifi className="h-4 w-4 text-accent" />
          <span>Galaxy Net</span>
        </div>
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

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">এলাকা নির্বাচন করুন <span className="text-red-500">*</span></Label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger><SelectValue placeholder="এলাকা বাছাই করুন" /></SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a.id} value={a.name}>{a.name_bn || a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">আপনার ঠিকানা</Label>
              <Input placeholder="বাসা নং / রোড নং" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">ফোন নাম্বার <span className="text-red-500">*</span></Label>
              <Input placeholder="01XXXXXXXXX" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={15} />
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
