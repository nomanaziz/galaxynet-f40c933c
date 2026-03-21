import { Link } from "react-router-dom";
import { Wifi, Phone, Mail, MapPin, Facebook, Youtube, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{ background: "hsl(var(--galaxy-blue-dark))" }} className="text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-galaxy-orange">
                <Wifi className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Galaxy Net</h3>
                <p className="text-xs text-orange-300">গ্যালাক্সি নেট</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">Fast. Reliable. Affordable.</p>
            <p className="text-blue-200 text-sm mt-1">দ্রুত। নির্ভরযোগ্য। সাশ্রয়ী।</p>
            <div className="flex gap-3 mt-4">
              {[Facebook, Youtube, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-galaxy-orange transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-galaxy-orange">Quick Links · লিংক</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              {[
                { href: "/", en: "Home", bn: "হোম" },
                { href: "/packages", en: "Packages", bn: "প্যাকেজ" },
                { href: "/services", en: "Services", bn: "সেবা" },
                { href: "/coverage", en: "Coverage Area", bn: "কভারেজ" },
                { href: "/about", en: "About Us", bn: "আমাদের সম্পর্কে" },
                { href: "/contact", en: "Contact Us", bn: "যোগাযোগ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-galaxy-orange transition-colors">{link.en} · {link.bn}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-galaxy-orange">Resources · রিসোর্স</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              {[
                { href: "/order", en: "New Connection", bn: "নতুন সংযোগ" },
                { href: "/speed-test", en: "Speed Test", bn: "স্পিড টেস্ট" },
                { href: "/notices", en: "Notices", bn: "নোটিশ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-galaxy-orange transition-colors">{link.en} · {link.bn}</Link>
                </li>
              ))}
              <li className="flex items-start gap-2 pt-3 border-t border-white/10 mt-3">
                <Phone className="h-4 w-4 mt-0.5 text-galaxy-orange shrink-0" />
                <span>+880 1700-000000<br />+880 1800-000000</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-galaxy-orange shrink-0" />
                <span>info@galaxynet.com.bd</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-galaxy-orange shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-galaxy-orange">Hours · সময়</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li className="flex justify-between"><span>Sat – Thu</span><span>9 AM – 10 PM</span></li>
              <li className="flex justify-between"><span>শনি – বৃহস্পতি</span><span>সকাল ৯ – রাত ১০</span></li>
              <li className="flex justify-between mt-2"><span>Friday / জুমা</span><span>2 PM – 10 PM</span></li>
              <li className="mt-3 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 font-medium">24/7 Support Available</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-blue-300 text-xs">
          <p>© 2024 Galaxy Net. All rights reserved. · সর্বস্বত্ব সংরক্ষিত।</p>
          <p>Powered by Galaxy Net · গ্যালাক্সি নেট দ্বারা পরিচালিত</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
