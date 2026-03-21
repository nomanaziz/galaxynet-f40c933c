import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, ArrowRight, ArrowLeft, User, Phone, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const allPackages = [
  "Home Basic — 10 Mbps — ৳500/mo",
  "Home Standard — 50 Mbps — ৳900/mo",
  "Home Premium — 100 Mbps — ৳1500/mo",
  "Home Ultra — 200 Mbps — ৳2500/mo",
  "Business Starter — 100 Mbps — ৳3000/mo",
  "Business Pro — 300 Mbps — ৳6000/mo",
  "Business Enterprise — 1 Gbps — ৳12000/mo",
];

const steps = [
  { label: "Personal Info", labelBn: "ব্যক্তিগত তথ্য", icon: User },
  { label: "Address", labelBn: "ঠিকানা", icon: MapPin },
  { label: "Package", labelBn: "প্যাকেজ", icon: Package },
  { label: "Confirm", labelBn: "নিশ্চিত করুন", icon: CheckCircle },
];

const Order = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    area: "",
    package: "",
    date: undefined as Date | undefined,
    notes: "",
  });

  const update = (field: string, value: string | Date | undefined) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 0) return form.name.trim() && form.mobile.trim();
    if (step === 1) return form.address.trim() && form.area.trim();
    if (step === 2) return !!form.package;
    return true;
  };

  const handleSubmit = () => {
    toast({
      title: "Order Submitted! · অর্ডার জমা হয়েছে!",
      description: "We will contact you within 24 hours. · আমরা ২৪ ঘণ্টার মধ্যে যোগাযোগ করব।",
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center py-20 bg-background">
          <Card className="max-w-md w-full mx-4 border-2 border-galaxy-orange">
            <CardContent className="p-8 text-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-galaxy-blue mb-2">Order Received!</h2>
              <p className="text-xl font-semibold text-galaxy-orange mb-4">অর্ডার গৃহীত হয়েছে!</p>
              <p className="text-muted-foreground mb-2">Thank you, <strong>{form.name}</strong>. We will contact you at <strong>{form.mobile}</strong> within 24 hours.</p>
              <p className="text-muted-foreground text-sm mb-6">ধন্যবাদ। আমরা ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোग করব।</p>
              <div className="p-4 rounded-lg bg-secondary text-left text-sm space-y-1">
                <p><strong>Package:</strong> {form.package}</p>
                <p><strong>Area:</strong> {form.area}</p>
                {form.date && <p><strong>Preferred Date:</strong> {format(form.date, "PPP")}</p>}
              </div>
            </CardContent>
          </Card>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient text-white py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Order Connection</h1>
          <p className="text-2xl font-semibold text-orange-300 mb-4">নতুন সংযোগের জন্য আবেদন</p>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Fill out the form below and we'll get you connected!
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" className="fill-background w-full h-12 md:h-16">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 md:py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center flex-1">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  i <= step ? "bg-galaxy-orange text-white" : "bg-secondary text-muted-foreground"
                )}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className={cn("text-xs mt-1 font-medium hidden sm:block", i <= step ? "text-galaxy-orange" : "text-muted-foreground")}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <Card className="border-2">
            <CardContent className="p-6 md:p-8">
              {/* Step 0: Personal */}
              {step === 0 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-galaxy-blue">Personal Information · ব্যক্তিগত তথ্য</h3>
                  <div>
                    <Label htmlFor="name">Full Name · পূর্ণ নাম *</Label>
                    <Input id="name" placeholder="আপনার নাম লিখুন..." value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile Number · মোবাইল নম্বর *</Label>
                    <Input id="mobile" type="tel" placeholder="01XXXXXXXXX" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (Optional) · ইমেইল</Label>
                    <Input id="email" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-1" />
                  </div>
                </div>
              )}

              {/* Step 1: Address */}
              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-galaxy-blue">Address · ঠিকানা</h3>
                  <div>
                    <Label htmlFor="address">Full Address · সম্পূর্ণ ঠিকানা *</Label>
                    <Textarea id="address" placeholder="House/Flat, Road, Block..." value={form.address} onChange={(e) => update("address", e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="area">Area · এলাকা *</Label>
                    <Input id="area" placeholder="e.g. Dhanmondi, Gulshan..." value={form.area} onChange={(e) => update("area", e.target.value)} className="mt-1" />
                  </div>
                </div>
              )}

              {/* Step 2: Package */}
              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-galaxy-blue">Select Package · প্যাকেজ নির্বাচন</h3>
                  <div>
                    <Label>Internet Package · ইন্টারনেট প্যাকেজ *</Label>
                    <Select value={form.package} onValueChange={(v) => update("package", v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose a package · প্যাকেজ বাছাই করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {allPackages.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Preferred Installation Date · পছন্দের তারিখ</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full mt-1 justify-start text-left font-normal", !form.date && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.date ? format(form.date, "PPP") : "Pick a date · তারিখ বাছুন"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={form.date} onSelect={(d) => update("date", d)} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes · অতিরিক্ত তথ্য</Label>
                    <Textarea id="notes" placeholder="Any special instructions..." value={form.notes} onChange={(e) => update("notes", e.target.value)} className="mt-1" />
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-galaxy-blue">Confirm Order · অর্ডার নিশ্চিত করুন</h3>
                  <div className="p-4 rounded-lg bg-secondary space-y-2 text-sm">
                    <p><strong>Name:</strong> {form.name}</p>
                    <p><strong>Mobile:</strong> {form.mobile}</p>
                    {form.email && <p><strong>Email:</strong> {form.email}</p>}
                    <p><strong>Address:</strong> {form.address}</p>
                    <p><strong>Area:</strong> {form.area}</p>
                    <p><strong>Package:</strong> {form.package}</p>
                    {form.date && <p><strong>Installation Date:</strong> {format(form.date, "PPP")}</p>}
                    {form.notes && <p><strong>Notes:</strong> {form.notes}</p>}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Please review the information above. Our team will contact you within 24 hours to confirm your connection.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    উপরের তথ্য যাচাই করুন। আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                {step > 0 ? (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back · পেছনে
                  </Button>
                ) : <div />}
                {step < 3 ? (
                  <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-semibold">
                    Next · পরবর্তী <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-semibold">
                    Submit Order · অর্ডার করুন <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Order;
