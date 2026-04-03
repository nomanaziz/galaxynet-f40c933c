import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PageHeroDark from "@/components/PageHeroDark";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import breadcrumbImg from "@/assets/breadcrumb-support.jpg";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const { t } = useLanguage();
  const [s, setS] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("site_settings").select("key, value").then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => { if (r.key?.startsWith("contact_")) map[r.key] = r.value ?? ""; });
      setS(map);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const phone1 = s.contact_phone_1 || "+880 1700-000000";
  const phone2 = s.contact_phone_2 || "+880 1800-000000";
  const email1 = s.contact_email_1 || "info@galaxynet.com.bd";
  const email2 = s.contact_email_2 || "support@galaxynet.com.bd";
  const addressEn = s.contact_address_en || "House 12, Road 5, Dhanmondi, Dhaka-1209";
  const addressBn = s.contact_address_bn || "হাউজ ১২, রোড ৫, ধানমন্ডি, ঢাকা-১২০৯";
  const hoursEn = s.contact_hours_en || "Sat–Thu: 9 AM – 10 PM";
  const hoursBn = s.contact_hours_bn || "শনি–বৃহস্পতি: সকাল ৯ – রাত ১০";
  const friHoursEn = s.contact_friday_hours_en || "Friday: 2 PM – 10 PM";
  const friHoursBn = s.contact_friday_hours_bn || "জুমা: দুপুর ২ – রাত ১০";

  const contactDetails = [
    { icon: Phone, title: t("Phone", "ফোন"), lines: [phone1, phone2], note: t("Available 24/7", "২৪/৭ উপলব্ধ") },
    { icon: Mail, title: t("Email", "ইমেইল"), lines: [email1, email2], note: t("Reply within 24 hours", "২৪ ঘণ্টায় উত্তর") },
    { icon: MapPin, title: t("Address", "ঠিকানা"), lines: [t(addressEn, addressBn)], note: "" },
    { icon: Clock, title: t("Business Hours", "অফিস সময়"), lines: [t(hoursEn, hoursBn), t(friHoursEn, friHoursBn)], note: t("24/7 Tech Support", "২৪/৭ টেক সাপোর্ট") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />

      <section className="page-hero">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{t("Contact Us", "যোগাযোগ করুন")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t("Have questions? We're here to help 24/7.", "প্রশ্ন আছে? আমরা ২৪/৭ সাহায্য করতে প্রস্তুত।")}
          </p>
        </div>
      </section>

      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">{t("Send a Message", "বার্তা পাঠান")}</h2>
              {submitted ? (
                <div className="flex flex-col items-center text-center p-10 rounded-2xl border bg-green-50">
                  <CheckCircle className="h-14 w-14 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-green-700 mb-2">{t("Message Sent!", "বার্তা পাঠানো হয়েছে!")}</h3>
                  <p className="text-green-600 text-sm">{t("We'll get back to you within 24 hours.", "আমরা ২৪ ঘণ্টার মধ্যে যোগাযোগ করব।")}</p>
                  <Button className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", message: "" }); }}>
                    {t("Send Another", "আরেকটি পাঠান")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t("Full Name", "পূর্ণ নাম")} *</label>
                    <Input name="name" value={form.name} onChange={handleChange} placeholder={t("Your full name", "আপনার পূর্ণ নাম")} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t("Phone Number", "ফোন নম্বর")} *</label>
                    <Input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+880 1XXX-XXXXXX" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t("Email", "ইমেইল")}</label>
                    <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t("Message", "বার্তা")} *</label>
                    <Textarea name="message" value={form.message} onChange={handleChange} placeholder={t("Write your message...", "আপনার বার্তা লিখুন...")} required rows={5} className="resize-none" />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    <Send className="mr-2 h-4 w-4" /> {t("Send Message", "বার্তা পাঠান")}
                  </Button>
                </form>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">{t("Contact Details", "যোগাযোগের তথ্য")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {contactDetails.map((detail) => (
                  <Card key={detail.title} className="border hover:border-accent/40 transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                          <detail.icon className="h-5 w-5 text-accent" />
                        </div>
                        <p className="font-semibold text-foreground text-sm">{detail.title}</p>
                      </div>
                      {detail.lines.map((line, i) => (
                        <p key={i} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                      {detail.note && <p className="text-xs text-accent font-medium mt-2">{detail.note}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="rounded-2xl bg-primary p-6 text-primary-foreground text-center">
                <p className="text-lg font-bold mb-1">{t("Call Us Now!", "এখনই কল করুন!")}</p>
                <a href={`tel:${phone1.replace(/[^+\d]/g, "")}`}>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold w-full mt-3">
                    <Phone className="mr-2 h-5 w-5" /> {phone1}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
