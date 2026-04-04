import { useRef, useState } from "react";
import { CreditCard, Smartphone, Building2, Zap, ArrowRight, ChevronRight, AlertTriangle, Globe, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PageHeroDark from "@/components/PageHeroDark";
import { useLanguage } from "@/contexts/LanguageContext";
import breadcrumbImg from "@/assets/breadcrumb-payment.jpg";

const BKASH_STEPS = [
  { en: "Dial *247# from your bKash registered mobile number", bn: "আপনার bKash নিবন্ধিত মোবাইল নম্বর থেকে *247# ডায়াল করুন" },
  { en: "Select 'Pay Bill'", bn: "'Pay Bill' নির্বাচন করুন" },
  { en: "Enter Galaxy Net Biller ID: 00000000", bn: "Galaxy Net Biller ID লিখুন: 00000000" },
  { en: "Enter your Galaxy Net Client ID as Bill Number", bn: "আপনার Galaxy Net Client ID বিল নম্বর হিসেবে লিখুন" },
  { en: "Enter the amount and confirm with your bKash PIN", bn: "পরিমাণ লিখুন এবং আপনার bKash PIN দিয়ে নিশ্চিত করুন" },
];

const NAGAD_STEPS = [
  { en: "Dial *167# from your Nagad registered mobile number", bn: "আপনার Nagad নিবন্ধিত মোবাইল নম্বর থেকে *167# ডায়াল করুন" },
  { en: "Select 'Pay Bill' and choose Galaxy Net", bn: "'Pay Bill' নির্বাচন করুন এবং Galaxy Net বেছে নিন" },
  { en: "Enter your Galaxy Net Client ID as Account Number", bn: "আপনার Galaxy Net Client ID অ্যাকাউন্ট নম্বর হিসেবে লিখুন" },
  { en: "Enter the amount and confirm with your Nagad PIN", bn: "পরিমাণ লিখুন এবং আপনার Nagad PIN দিয়ে নিশ্চিত করুন" },
];

const BANKS = [
  { name: "BRAC Bank", color: "#0b3d91", account: "00000000000", branch: "Dhaka Main Branch", routing: "000000000" },
  { name: "Eastern Bank", color: "#006341", account: "00000000000", branch: "Gulshan Branch", routing: "000000000" },
  { name: "City Bank", color: "#c41230", account: "00000000000", branch: "Motijheel Branch", routing: "000000000" },
  { name: "ONE Bank", color: "#f7941d", account: "00000000000", branch: "Dhanmondi Branch", routing: "000000000" },
  { name: "Dutch-Bangla Bank", color: "#00a550", account: "00000000000", branch: "Banani Branch", routing: "000000000" },
];

const GATEWAYS = [
  { name: "Visa", color: "#1a1f71" },
  { name: "Mastercard", color: "#eb001b" },
  { name: "Amex", color: "#006fcf" },
  { name: "bKash", color: "#e2136e" },
  { name: "Nagad", color: "#f6921e" },
  { name: "Rocket", color: "#8b2e8b" },
  { name: "Upay", color: "#00a651" },
  { name: "Tap", color: "#0066cc" },
];

const Payment = () => {
  const { t } = useLanguage();
  const [agreed, setAgreed] = useState(false);
  const mobileBankingRef = useRef<HTMLDivElement>(null);
  const onlinePayRef = useRef<HTMLDivElement>(null);
  const bankTransferRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <Navbar />

      <PageHeroDark
        title="Pay Bill"
        titleBn="বিল পরিশোধ"
        subtitle="Choose your preferred payment method to pay your bill."
        subtitleBn="আপনার বিল পরিশোধ করতে পছন্দের পদ্ধতি বেছে নিন।"
        bgImage={breadcrumbImg}
      />

      {/* 1. Quick Pay Hero */}
      <section className="py-10 md:py-14 bg-accent/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="overflow-hidden border-accent/20 bg-gradient-to-br from-accent/10 via-background to-accent/5 relative">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                <Zap className="h-4 w-4" />
                {t("Quick Pay", "কুইক পে")}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                {t("Pay your bill instantly", "তাৎক্ষণিক বিল পরিশোধ করুন")}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {t(
                  "Log in to our portal and pay your Galaxy Net bill with just a few clicks.",
                  "আমাদের পোর্টালে লগইন করুন এবং মাত্র কয়েক ক্লিকে Galaxy Net বিল পরিশোধ করুন।"
                )}
              </p>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base px-8"
                onClick={() => window.open("https://portal.galaxynetbd.com/quickpay", "_blank")}
              >
                {t("PAY NOW", "এখনই পরিশোধ করুন")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. How to Pay */}
      <section className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-accent rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t("How to pay?", "কিভাবে পরিশোধ করবেন?")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Smartphone, label: t("Mobile Banking", "মোবাইল ব্যাংকিং"), desc: t("Pay via bKash or Nagad", "bKash বা Nagad দিয়ে পরিশোধ করুন"), ref: mobileBankingRef, color: "bg-pink-500" },
              { icon: Globe, label: t("Online Payment", "অনলাইন পেমেন্ট"), desc: t("Pay via portal with card or wallet", "কার্ড বা ওয়ালেট দিয়ে পোর্টালে পরিশোধ করুন"), ref: onlinePayRef, color: "bg-blue-500" },
              { icon: Building2, label: t("Bank Transfer", "ব্যাংক ট্রান্সফার"), desc: t("Direct deposit to our bank account", "আমাদের ব্যাংক অ্যাকাউন্টে সরাসরি জমা দিন"), ref: bankTransferRef, color: "bg-green-600" },
            ].map((item, i) => (
              <Card
                key={i}
                className="cursor-pointer hover:shadow-lg hover:border-accent/40 transition-all group"
                onClick={() => scrollTo(item.ref)}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`${item.color} text-white p-3 rounded-xl shrink-0`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground">{item.label}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Mobile Banking */}
      <section ref={mobileBankingRef} className="py-10 md:py-14 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-pink-500 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t("Pay bill with Mobile Banking", "মোবাইল ব্যাংকিং দিয়ে বিল পরিশোধ")}
            </h2>
          </div>

          <Tabs defaultValue="bkash" className="max-w-2xl">
            <TabsList className="bg-muted mb-6 h-12">
              <TabsTrigger value="bkash" className="text-base px-6 data-[state=active]:bg-[#e2136e] data-[state=active]:text-white">
                bKash
              </TabsTrigger>
              <TabsTrigger value="nagad" className="text-base px-6 data-[state=active]:bg-[#f6921e] data-[state=active]:text-white">
                Nagad
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bkash">
              <Card>
                <CardContent className="p-6 space-y-4">
                  {BKASH_STEPS.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e2136e] text-white text-sm font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-foreground pt-1">{t(step.en, step.bn)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nagad">
              <Card>
                <CardContent className="p-6 space-y-4">
                  {NAGAD_STEPS.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f6921e] text-white text-sm font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-foreground pt-1">{t(step.en, step.bn)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* 4. Portal / Online Payment */}
      <section ref={onlinePayRef} className="py-10 md:py-14 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-blue-500 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t("Pay bill through Portal", "পোর্টালের মাধ্যমে বিল পরিশোধ")}
            </h2>
          </div>

          <Card className="max-w-2xl">
            <CardContent className="p-6 space-y-6">
              <p className="text-muted-foreground">
                {t(
                  "You can pay your Galaxy Net bill through our payment portal using any of the following methods:",
                  "নিচের যেকোনো পদ্ধতি ব্যবহার করে আমাদের পেমেন্ট পোর্টালের মাধ্যমে Galaxy Net বিল পরিশোধ করতে পারেন:"
                )}
              </p>

              <div className="grid grid-cols-4 gap-3">
                {GATEWAYS.map((g) => (
                  <div
                    key={g.name}
                    className="flex items-center justify-center h-14 rounded-lg border text-white font-bold text-sm"
                    style={{ backgroundColor: g.color }}
                  >
                    {g.name}
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(v) => setAgreed(v === true)}
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  {t(
                    "I agree that the payment is non-refundable and subject to Galaxy Net terms & conditions.",
                    "আমি সম্মত যে পেমেন্টটি অ-ফেরতযোগ্য এবং Galaxy Net-এর শর্তাবলী অনুযায়ী।"
                  )}
                </label>
              </div>

              <Button
                size="lg"
                disabled={!agreed}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                onClick={() => window.open("https://portal.galaxynetbd.com/quickpay", "_blank")}
              >
                {t("PAY NOW", "এখনই পরিশোধ করুন")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Bank Transfer */}
      <section ref={bankTransferRef} className="py-10 md:py-14 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-green-600 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t("Direct Bank Transfer", "সরাসরি ব্যাংক ট্রান্সফার")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BANKS.map((bank) => (
              <Card key={bank.name} className="overflow-hidden">
                <div className="px-5 py-3 text-white font-bold text-lg" style={{ backgroundColor: bank.color }}>
                  {bank.name}
                </div>
                <CardContent className="p-5 space-y-3">
                  {[
                    { label: t("Account Name", "অ্যাকাউন্টের নাম"), value: "Galaxy Net" },
                    { label: t("Account No", "অ্যাকাউন্ট নম্বর"), value: bank.account },
                    { label: t("Branch", "শাখা"), value: bank.branch },
                    { label: t("Routing No", "রাউটিং নম্বর"), value: bank.routing },
                  ].map((row) => (
                    <div key={row.label}>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{row.label}</p>
                      <p className="text-foreground font-mono font-semibold">{row.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. USSD Warning */}
      <section className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <Alert className="border-yellow-400/50 bg-yellow-50 dark:bg-yellow-950/20">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-400 font-bold">
              {t("Important Notice", "গুরুত্বপূর্ণ বিজ্ঞপ্তি")}
            </AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-300/80 space-y-2 mt-2">
              <p>
                {t(
                  "You must need to contact with our helpline to update your payment if you use USSD, Bank Payment or Mobile Banking App to pay the bill.",
                  "আপনি যদি USSD, ব্যাংক পেমেন্ট বা মোবাইল ব্যাংকিং অ্যাপ ব্যবহার করে বিল পরিশোধ করেন তাহলে পেমেন্ট আপডেট করতে আমাদের হেল্পলাইনে যোগাযোগ করতে হবে।"
                )}
              </p>
              <div className="flex flex-wrap gap-4 pt-1 text-sm font-medium">
                <span>{t("Helpline", "হেল্পলাইন")}: <strong className="font-mono">00000000000</strong></span>
                <span>{t("Email", "ইমেইল")}: <strong>accounts@galaxynetbd.com</strong></span>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Payment;
