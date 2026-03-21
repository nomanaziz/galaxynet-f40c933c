import { Bell, AlertTriangle, Gift, Wrench, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const notices = [
  {
    date: "2024-12-15",
    title: "Scheduled Maintenance — Dhanmondi Area",
    titleBn: "নির্ধারিত রক্ষণাবেক্ষণ — ধানমন্ডি এলাকা",
    category: "maintenance",
    desc: "Fiber maintenance work on Dec 18 from 2 AM to 6 AM. Service may be temporarily disrupted.",
    descBn: "১৮ ডিসেম্বর রাত ২টা থেকে ভোর ৬টা পর্যন্ত ফাইবার রক্ষণাবেক্ষণ কাজ। সেবা সাময়িকভাবে বিঘ্নিত হতে পারে।",
  },
  {
    date: "2024-12-10",
    title: "New Year Offer — 3 Months Free!",
    titleBn: "নববর্ষ অফার — ৩ মাস ফ্রি!",
    category: "offer",
    desc: "Subscribe to any Home Premium or Ultra plan before Dec 31 and get 3 months free! Limited time offer.",
    descBn: "৩১ ডিসেম্বরের আগে যেকোনো হোম প্রিমিয়াম বা আলট্রা প্ল্যানে সাবস্ক্রাইব করুন এবং ৩ মাস ফ্রি পান!",
  },
  {
    date: "2024-12-05",
    title: "Fiber Cut — Gulshan Area Restored",
    titleBn: "ফাইবার কাটা — গুলশান এলাকা পুনরুদ্ধার",
    category: "alert",
    desc: "The fiber cut in Gulshan-2 area has been repaired. All services are now fully operational.",
    descBn: "গুলশান-২ এলাকায় ফাইবার কাটা মেরামত করা হয়েছে। সকল সেবা এখন সম্পূর্ণ চালু।",
  },
  {
    date: "2024-11-28",
    title: "Upgrade to 200 Mbps — Special Discount",
    titleBn: "২০০ Mbps এ আপগ্রেড — বিশেষ ছাড়",
    category: "offer",
    desc: "Existing customers can upgrade to 200 Mbps at 20% discount. Contact support to upgrade.",
    descBn: "বিদ্যমান গ্রাহকরা ২০% ছাড়ে ২০০ Mbps-এ আপগ্রেড করতে পারবেন।",
  },
  {
    date: "2024-11-20",
    title: "System Update — Improved Routing",
    titleBn: "সিস্টেম আপডেট — উন্নত রাউটিং",
    category: "maintenance",
    desc: "We've upgraded our core routing infrastructure for better BDIX and international speeds.",
    descBn: "আমরা উন্নত BDIX এবং আন্তর্জাতিক গতির জন্য আমাদের কোর রাউটিং ইনফ্রাস্ট্রাকচার আপগ্রেড করেছি।",
  },
];

const categoryConfig: Record<string, { label: string; icon: typeof Bell; color: string }> = {
  maintenance: { label: "Maintenance · রক্ষণাবেক্ষণ", icon: Wrench, color: "bg-blue-100 text-blue-700" },
  offer: { label: "Offer · অফার", icon: Gift, color: "bg-green-100 text-green-700" },
  alert: { label: "Alert · সতর্কতা", icon: AlertTriangle, color: "bg-red-100 text-red-700" },
};

const Notices = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient text-white py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Notices & Updates</h1>
          <p className="text-2xl font-semibold text-orange-300 mb-4">নোটিশ ও আপডেট</p>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Stay informed about maintenance schedules, offers, and service updates.
          </p>
          <p className="text-blue-300 text-sm mt-2">রক্ষণাবেক্ষণ, অফার ও সেবা আপডেট সম্পর্কে জানুন।</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" className="fill-background w-full h-12 md:h-16">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-12 md:py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-6">
            {notices.map((n) => {
              const cat = categoryConfig[n.category];
              return (
                <Card key={n.title} className="border-2 hover:border-galaxy-orange transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge className={`${cat.color} border-0 flex items-center gap-1`}>
                        <cat.icon className="h-3 w-3" />
                        {cat.label}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {n.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-galaxy-blue">{n.title}</h3>
                    <p className="text-galaxy-orange text-sm font-medium mb-2">{n.titleBn}</p>
                    <p className="text-muted-foreground text-sm">{n.desc}</p>
                    <p className="text-muted-foreground text-xs mt-1">{n.descBn}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Notices;
