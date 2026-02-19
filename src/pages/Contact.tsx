import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contactDetails = [
  {
    icon: Phone,
    title: "Phone · ফোন",
    lines: ["+880 1700-000000", "+880 1800-000000"],
    note: "Available 24/7 · ২৪/৭ উপলব্ধ",
  },
  {
    icon: Mail,
    title: "Email · ইমেইল",
    lines: ["info@galaxynet.com.bd", "support@galaxynet.com.bd"],
    note: "Reply within 24 hours",
  },
  {
    icon: MapPin,
    title: "Address · ঠিকানা",
    lines: ["Galaxy Net, House 12, Road 5", "Dhanmondi, Dhaka-1209", "ধানমন্ডি, ঢাকা-১২০৯"],
    note: "",
  },
  {
    icon: Clock,
    title: "Business Hours · অফিস সময়",
    lines: ["Sat–Thu: 9 AM – 10 PM", "শনি–বৃহস্পতি: সকাল ৯ – রাত ১০", "Friday: 2 PM – 10 PM"],
    note: "24/7 Tech Support · ২৪/৭ টেক সাপোর্ট",
  },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
          <p className="text-2xl font-semibold text-orange-300 mb-4">যোগাযোগ করুন</p>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Have questions? We're here to help 24/7. Get in touch with our friendly team!
          </p>
          <p className="text-blue-300 text-sm mt-2 max-w-xl mx-auto">
            প্রশ্ন আছে? আমরা ২৪/৭ সাহায্য করতে প্রস্তুত। আমাদের বন্ধুত্বপূর্ণ দলের সাথে যোগাযোগ করুন!
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" className="fill-background w-full h-12 md:h-16">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-galaxy-blue mb-2">Send a Message</h2>
              <p className="text-galaxy-orange font-medium mb-6">বার্তা পাঠান</p>

              {submitted ? (
                <div className="flex flex-col items-center text-center p-10 rounded-2xl border-2 border-green-200 bg-green-50">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-green-700 mb-2">Message Sent! · বার্তা পাঠানো হয়েছে!</h3>
                  <p className="text-green-600">We'll get back to you within 24 hours.</p>
                  <p className="text-green-600 text-sm mt-1">আমরা ২৪ ঘণ্টার মধ্যে যোগাযোগ করব।</p>
                  <Button
                    className="mt-6 bg-galaxy-orange hover:bg-galaxy-orange-dark text-white"
                    onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", message: "" }); }}
                  >
                    Send Another · আরেকটি পাঠান
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-galaxy-blue mb-1.5">
                      Full Name · পূর্ণ নাম <span className="text-galaxy-orange">*</span>
                    </label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name · আপনার পূর্ণ নাম"
                      required
                      className="border-2 border-galaxy-blue/20 focus-visible:ring-galaxy-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-galaxy-blue mb-1.5">
                      Phone Number · ফোন নম্বর <span className="text-galaxy-orange">*</span>
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+880 1XXX-XXXXXX"
                      required
                      className="border-2 border-galaxy-blue/20 focus-visible:ring-galaxy-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-galaxy-blue mb-1.5">
                      Email Address · ইমেইল
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="border-2 border-galaxy-blue/20 focus-visible:ring-galaxy-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-galaxy-blue mb-1.5">
                      Message · বার্তা <span className="text-galaxy-orange">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your message here... · আপনার বার্তা এখানে লিখুন..."
                      required
                      rows={5}
                      className="border-2 border-galaxy-blue/20 focus-visible:ring-galaxy-orange resize-none"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-bold py-6 text-lg">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message · বার্তা পাঠান
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-bold text-galaxy-blue mb-2">Contact Details</h2>
              <p className="text-galaxy-orange font-medium mb-6">যোগাযোগের তথ্য</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {contactDetails.map((detail) => (
                  <Card key={detail.title} className="border-2 hover:border-galaxy-orange transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-galaxy-orange/10 flex items-center justify-center">
                          <detail.icon className="h-5 w-5 text-galaxy-orange" />
                        </div>
                        <p className="font-bold text-galaxy-blue text-sm">{detail.title}</p>
                      </div>
                      {detail.lines.map((line, i) => (
                        <p key={i} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                      {detail.note && (
                        <p className="text-xs text-galaxy-orange font-medium mt-2">{detail.note}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick CTA */}
              <div className="hero-gradient rounded-2xl p-6 text-white text-center">
                <p className="text-lg font-bold mb-1">Call Us Now!</p>
                <p className="text-orange-300 font-semibold mb-3">এখনই কল করুন!</p>
                <a href="tel:+8801700000000">
                  <Button size="lg" className="bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-bold w-full">
                    <Phone className="mr-2 h-5 w-5" />
                    +880 1700-000000
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
