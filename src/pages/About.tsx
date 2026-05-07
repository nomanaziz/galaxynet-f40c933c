import { useEffect, useState } from "react";
import { Users, Award, Wifi, Shield, Zap, HeadphonesIcon, Clock, Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeroDark from "@/components/PageHeroDark";
import PartnersSection from "@/components/home/PartnersSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import breadcrumbImg from "@/assets/breadcrumb-network.jpg";

const iconMap: Record<string, any> = { Users, Award, Wifi, Shield, Zap, HeadphonesIcon, Clock, Server };

const defaultStats = [
  { num: "10,000+", label: "Happy Customers", label_bn: "সন্তুষ্ট গ্রাহক", icon: "Users" },
  { num: "99.9%", label: "Uptime", label_bn: "আপটাইম", icon: "Shield" },
  { num: "50+", label: "Coverage Areas", label_bn: "কভারেজ এলাকা", icon: "Wifi" },
  { num: "24/7", label: "Support", label_bn: "সাপোর্ট", icon: "HeadphonesIcon" },
];

const defaultTimeline = [
  { year: "2015", title: "Founded", title_bn: "প্রতিষ্ঠিত", desc: "Galaxy Net started with a vision to connect Bangladesh.", desc_bn: "গ্যালাক্সি নেট বাংলাদেশকে সংযুক্ত করার লক্ষ্যে যাত্রা শুরু করে।" },
  { year: "2017", title: "1000 Customers", title_bn: "১০০০ গ্রাহক", desc: "Reached our first milestone.", desc_bn: "প্রথম মাইলফলকে পৌঁছেছি।" },
  { year: "2019", title: "Fiber Optic Upgrade", title_bn: "ফাইবার অপটিক আপগ্রেড", desc: "Migrated entire network to fiber optic.", desc_bn: "সম্পূর্ণ নেটওয়ার্ক ফাইবার অপটিকে স্থানান্তর।" },
  { year: "2021", title: "Citywide Expansion", title_bn: "শহরব্যাপী সম্প্রসারণ", desc: "Expanded to 50+ areas.", desc_bn: "৫০+ এলাকায় সম্প্রসারণ।" },
  { year: "2024", title: "10K+ Customers", title_bn: "১০,০০০+ গ্রাহক", desc: "Serving over 10,000 homes and businesses.", desc_bn: "১০,০০০+ ঘর ও ব্যবসায় সেবা প্রদান।" },
];

interface TeamMember {
  id: string;
  name: string;
  name_bn: string | null;
  photo_url: string | null;
  department_id: string | null;
  departments: { name: string; name_bn: string | null } | null;
  designations: { name: string; name_bn: string | null } | null;
}

interface Department {
  id: string;
  name: string;
  name_bn: string | null;
  sort_order: number;
}

function safeParse<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  try { return JSON.parse(json); } catch { return fallback; }
}

const About = () => {
  const { t } = useLanguage();
  const [heroEn, setHeroEn] = useState("Connecting Bangladesh with fast, reliable internet since 2015.");
  const [heroBn, setHeroBn] = useState("২০১৫ সাল থেকে দ্রুত ও নির্ভরযোগ্য ইন্টারনেটে সংযুক্ত করছি।");
  const [stats, setStats] = useState(defaultStats);
  const [timeline, setTimeline] = useState(defaultTimeline);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [journeyTitle, setJourneyTitle] = useState({ en: "Our Journey", bn: "আমাদের পথচলা" });
  const [journeySub, setJourneySub] = useState({ en: "From a small local ISP to serving 10,000+ customers across Bangladesh.", bn: "একটি ছোট স্থানীয় ISP থেকে বাংলাদেশজুড়ে ১০,০০০+ গ্রাহকে সেবা প্রদান।" });

  useEffect(() => {
    // Fetch site settings
    supabase.from("site_settings").select("key, value").then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => { if (r.key) map[r.key] = r.value ?? ""; });
      if (map.about_hero_en) setHeroEn(map.about_hero_en);
      if (map.about_hero_bn) setHeroBn(map.about_hero_bn);
      setStats(safeParse(map.about_stats, defaultStats));
      setTimeline(safeParse(map.about_timeline, defaultTimeline));
      setJourneyTitle({ en: map.about_journey_title_en || "Our Journey", bn: map.about_journey_title_bn || "আমাদের পথচলা" });
      setJourneySub({ en: map.about_journey_sub_en || "From a small local ISP to serving 10,000+ customers across Bangladesh.", bn: map.about_journey_sub_bn || "একটি ছোট স্থানীয় ISP থেকে বাংলাদেশজুড়ে ১০,০০০+ গ্রাহকে সেবা প্রদান।" });
    });
    // Fetch team from employees table
    (supabase.from("public_employees" as any)
      .select("id, name, name_bn, photo_url, department_id, departments(name, name_bn), designations(name, name_bn)")
      .eq("show_on_about", true)
      .order("sort_order") as any)
      .then(({ data }) => { setTeam((data as TeamMember[]) ?? []); });
    // Fetch departments
    supabase.from("departments").select("id, name, name_bn, sort_order").eq("visible", true).order("sort_order")
      .then(({ data }) => { setDepartments((data as Department[]) ?? []); });
    // Fetch partners
    supabase.from("partners").select("*").eq("visible", true).order("sort_order")
      .then(({ data }) => { setPartners(data ?? []); });
  }, []);

  return (
    <>

      <PageHeroDark
        title="About Galaxy Net"
        titleBn="গ্যালাক্সি নেট সম্পর্কে"
        subtitle={heroEn}
        subtitleBn={heroBn}
        bgImage={breadcrumbImg}
      />

      {/* Stats */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = iconMap[s.icon] || Users;
              return (
                <Card key={s.label} className="border hover:border-accent/40 transition-all">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-7 w-7 text-accent mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground">{s.num}</div>
                    <p className="text-sm text-muted-foreground">{t(s.label, s.label_bn || s.label)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Server, label: t("BDIX Connected", "BDIX সংযুক্ত") },
              { icon: Zap, label: t("Fiber Optic", "ফাইবার অপটিক") },
              { icon: Shield, label: t("99.9% Uptime", "৯৯.৯% আপটাইম") },
              { icon: Clock, label: t("Since 2015", "২০১৫ থেকে") },
            ].map((b) => (
              <Badge key={b.label} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground border-0">
                <b.icon className="h-4 w-4" /> {b.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">{t(journeyTitle.en, journeyTitle.bn)}</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            {t(journeySub.en, journeySub.bn)}
          </p>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={item.year} className={`relative flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-accent flex items-center justify-center z-10">
                    <Award className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className={`ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <Badge className="bg-accent text-accent-foreground border-0 mb-2">{item.year}</Badge>
                    <h3 className="font-bold text-foreground">{t(item.title, item.title_bn || item.title)}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{t(item.desc, item.desc_bn || item.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">{t("Our Team", "আমাদের দল")}</h2>
          <div className="space-y-12 max-w-5xl mx-auto">
            {departments.map((dept) => {
              const members = team.filter((m) => m.department_id === dept.id);
              if (members.length === 0) return null;
              return (
                <div key={dept.id}>
                  <h3 className="text-xl font-semibold text-foreground text-center mb-6 flex items-center gap-3 justify-center">
                    <span className="h-px w-12 bg-border" />
                    {t(dept.name, dept.name_bn || dept.name)}
                    <span className="h-px w-12 bg-border" />
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {members.map((member) => (
                      <Card key={member.id} className="border hover:border-accent/40 transition-all">
                        <CardContent className="p-6 text-center">
                          {member.photo_url ? (
                            <img src={member.photo_url} alt={member.name} className="h-16 w-16 rounded-full object-cover mx-auto mb-4" />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                              <Users className="h-8 w-8 text-accent" />
                            </div>
                          )}
                          <h3 className="font-bold text-foreground">{t(member.name, member.name_bn || member.name)}</h3>
                          {member.designations && (
                            <p className="text-sm text-accent font-medium mt-1">{t(member.designations.name, member.designations.name_bn || member.designations.name)}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
            {/* Members without department */}
            {team.filter((m) => !m.department_id).length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground text-center mb-6 flex items-center gap-3 justify-center">
                  <span className="h-px w-12 bg-border" />
                  {t("Other", "অন্যান্য")}
                  <span className="h-px w-12 bg-border" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {team.filter((m) => !m.department_id).map((member) => (
                    <Card key={member.id} className="border hover:border-accent/40 transition-all">
                      <CardContent className="p-6 text-center">
                        {member.photo_url ? (
                          <img src={member.photo_url} alt={member.name} className="h-16 w-16 rounded-full object-cover mx-auto mb-4" />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-accent" />
                          </div>
                        )}
                        <h3 className="font-bold text-foreground">{t(member.name, member.name_bn || member.name)}</h3>
                        {member.designations && (
                          <p className="text-sm text-accent font-medium mt-1">{t(member.designations.name, member.designations.name_bn || member.designations.name)}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partners */}
      <PartnersSection partners={partners} />

    </>
  );
};

export default About;
