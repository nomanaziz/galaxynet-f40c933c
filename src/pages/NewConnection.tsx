import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle, Wifi } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const serviceOptions = [
  { value: "new_connection", label: "নতুন কানেকশন" },
  { value: "ftp_server", label: "এফটিপি সার্ভার" },
  { value: "customer_support", label: "কাস্টমার সাপোর্ট" },
  { value: "shifting", label: "শিফটিং" },
  { value: "slow_speed", label: "ধীর গতি" },
  { value: "referral", label: "রেফার" },
];

const NewConnection = () => {
  const [areas, setAreas] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("new_connection");
  const [nid, setNid] = useState("");
  const [dob, setDob] = useState<Date>();

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
    const notesData = JSON.stringify({
      service_type: serviceType,
      nid: nid || null,
      dob: dob ? format(dob, "yyyy-MM-dd") : null,
      source: "landing_page",
    });

    const { error } = await supabase.from("connection_orders").insert({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      address: address.trim() || "N/A",
      area,
      notes: notesData,
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
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">নতুন কানেকশনের জন্য আবেদন করুন</h1>
            <p className="text-white/60 text-sm">নিচের ফর্মটি পূরণ করুন, আমরা শীঘ্রই যোগাযোগ করবো</p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">আপনার নাম <span className="text-red-500">*</span></Label>
              <Input placeholder="সম্পূর্ণ নাম লিখুন" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            {/* Area */}
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

            {/* Address */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">আপনার ঠিকানা</Label>
              <Input placeholder="বাসা নং / রোড নং" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">ফোন নাম্বার <span className="text-red-500">*</span></Label>
              <Input placeholder="01XXXXXXXXX" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={15} />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">ইমেইল এড্রেস</Label>
              <Input placeholder="email@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">কোন সার্ভিস সম্পর্কে জানতে চান?</Label>
              <RadioGroup value={serviceType} onValueChange={setServiceType} className="grid grid-cols-2 gap-2">
                {serviceOptions.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2 p-2 rounded-lg border hover:border-accent/40 transition-colors">
                    <RadioGroupItem value={opt.value} id={opt.value} />
                    <Label htmlFor={opt.value} className="text-sm cursor-pointer">{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* NID */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">আপনার এনআইডি নাম্বার</Label>
              <Input placeholder="এনআইডি নম্বর (ঐচ্ছিক)" value={nid} onChange={(e) => setNid(e.target.value)} />
            </div>

            {/* DOB */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">আপনার জন্ম তারিখ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dob && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dob ? format(dob, "PPP") : "তারিখ বাছাই করুন"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={setDob}
                    disabled={(date) => date > new Date() || date < new Date("1950-01-01")}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={submitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base py-6">
              {submitting ? "জমা হচ্ছে..." : "ফর্ম সাবমিট করুন"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              আপনার তথ্য সম্পূর্ণ নিরাপদ এবং গোপনীয়
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewConnection;
