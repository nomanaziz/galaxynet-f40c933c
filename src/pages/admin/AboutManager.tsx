import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";

interface StatItem {
  num: string;
  label: string;
  label_bn: string;
  icon: string;
}

interface TimelineItem {
  year: string;
  title: string;
  title_bn: string;
  desc: string;
  desc_bn: string;
}

const defaultStats: StatItem[] = [
  { num: "10,000+", label: "Happy Customers", label_bn: "সন্তুষ্ট গ্রাহক", icon: "Users" },
  { num: "99.9%", label: "Uptime", label_bn: "আপটাইম", icon: "Shield" },
  { num: "50+", label: "Coverage Areas", label_bn: "কভারেজ এলাকা", icon: "Wifi" },
  { num: "24/7", label: "Support", label_bn: "সাপোর্ট", icon: "HeadphonesIcon" },
];

const defaultTimeline: TimelineItem[] = [
  { year: "2015", title: "Founded", title_bn: "প্রতিষ্ঠিত", desc: "Galaxy Net started with a vision to connect Bangladesh.", desc_bn: "গ্যালাক্সি নেট বাংলাদেশকে সংযুক্ত করার লক্ষ্যে যাত্রা শুরু করে।" },
  { year: "2017", title: "1000 Customers", title_bn: "১০০০ গ্রাহক", desc: "Reached our first milestone.", desc_bn: "প্রথম মাইলফলকে পৌঁছেছি।" },
  { year: "2019", title: "Fiber Optic Upgrade", title_bn: "ফাইবার অপটিক আপগ্রেড", desc: "Migrated entire network to fiber optic.", desc_bn: "সম্পূর্ণ নেটওয়ার্ক ফাইবার অপটিকে স্থানান্তর।" },
  { year: "2021", title: "Citywide Expansion", title_bn: "শহরব্যাপী সম্প্রসারণ", desc: "Expanded to 50+ areas.", desc_bn: "৫০+ এলাকায় সম্প্রসারণ।" },
  { year: "2024", title: "10K+ Customers", title_bn: "১০,০০০+ গ্রাহক", desc: "Serving over 10,000 homes and businesses.", desc_bn: "১০,০০০+ ঘর ও ব্যবসায় সেবা প্রদান।" },
];

const iconOptions = ["Users", "Award", "Wifi", "Shield", "Zap", "HeadphonesIcon", "Clock", "Server"];

function safeParse<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch { return fallback; }
}

const AboutManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [heroEn, setHeroEn] = useState("");
  const [heroBn, setHeroBn] = useState("");
  const [journeyTitleEn, setJourneyTitleEn] = useState("");
  const [journeyTitleBn, setJourneyTitleBn] = useState("");
  const [journeySubEn, setJourneySubEn] = useState("");
  const [journeySubBn, setJourneySubBn] = useState("");
  const [stats, setStats] = useState<StatItem[]>(defaultStats);
  const [timeline, setTimeline] = useState<TimelineItem[]>(defaultTimeline);

  const { isLoading } = useQuery({
    queryKey: ["about_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => { map[r.key] = r.value ?? ""; });
      setHeroEn(map.about_hero_en || "Connecting Bangladesh with fast, reliable internet since 2015.");
      setHeroBn(map.about_hero_bn || "২০১৫ সাল থেকে দ্রুত ও নির্ভরযোগ্য ইন্টারনেটে সংযুক্ত করছি।");
      setJourneyTitleEn(map.about_journey_title_en || "Our Journey");
      setJourneyTitleBn(map.about_journey_title_bn || "আমাদের পথচলা");
      setJourneySubEn(map.about_journey_sub_en || "From a small local ISP to serving 10,000+ customers across Bangladesh.");
      setJourneySubBn(map.about_journey_sub_bn || "একটি ছোট স্থানীয় ISP থেকে বাংলাদেশজুড়ে ১০,০০০+ গ্রাহকে সেবা প্রদান।");
      setStats(safeParse(map.about_stats, defaultStats));
      setTimeline(safeParse(map.about_timeline, defaultTimeline));
      return map;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const entries: Record<string, string> = {
        about_hero_en: heroEn,
        about_hero_bn: heroBn,
        about_journey_title_en: journeyTitleEn,
        about_journey_title_bn: journeyTitleBn,
        about_journey_sub_en: journeySubEn,
        about_journey_sub_bn: journeySubBn,
        about_stats: JSON.stringify(stats),
        about_timeline: JSON.stringify(timeline),
      };
      for (const [key, value] of Object.entries(entries)) {
        const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).maybeSingle();
        if (existing) {
          await supabase.from("site_settings").update({ value }).eq("key", key);
        } else {
          await supabase.from("site_settings").insert({ key, value });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about_settings"] });
      toast({ title: "About page saved!" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Stats helpers
  const updateStat = (i: number, field: keyof StatItem, value: string) => {
    setStats((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };
  const addStat = () => setStats((p) => [...p, { num: "", label: "", label_bn: "", icon: "Users" }]);
  const removeStat = (i: number) => setStats((p) => p.filter((_, idx) => idx !== i));

  // Timeline helpers
  const updateTimeline = (i: number, field: keyof TimelineItem, value: string) => {
    setTimeline((prev) => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  };
  const addTimeline = () => setTimeline((p) => [...p, { year: "", title: "", title_bn: "", desc: "", desc_bn: "" }]);
  const removeTimeline = (i: number) => setTimeline((p) => p.filter((_, idx) => idx !== i));
  const moveTimeline = (i: number, dir: -1 | 1) => {
    setTimeline((prev) => {
      const arr = [...prev];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">About Page Manager</h1>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? "Saving..." : "Save All"}
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Hero Subtitle (EN)</Label>
            <Textarea value={heroEn} onChange={(e) => setHeroEn(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Hero Subtitle (BN)</Label>
            <Textarea value={heroBn} onChange={(e) => setHeroBn(e.target.value)} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Stats Section</CardTitle>
            <Button variant="outline" size="sm" onClick={addStat}><Plus className="mr-1 h-4 w-4" /> Add Stat</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((s, i) => (
            <div key={i} className="p-4 rounded-lg border bg-secondary/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Stat #{i + 1}</span>
                <Button variant="ghost" size="icon" onClick={() => removeStat(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs">Number</Label>
                  <Input value={s.num} onChange={(e) => updateStat(i, "num", e.target.value)} className="mt-1" placeholder="10,000+" />
                </div>
                <div>
                  <Label className="text-xs">Label (EN)</Label>
                  <Input value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Label (BN)</Label>
                  <Input value={s.label_bn} onChange={(e) => updateStat(i, "label_bn", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Icon</Label>
                  <select
                    value={s.icon}
                    onChange={(e) => updateStat(i, "icon", e.target.value)}
                    className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {iconOptions.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Journey / Timeline Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>আমাদের পথচলা (Journey Timeline)</CardTitle>
            <Button variant="outline" size="sm" onClick={addTimeline}><Plus className="mr-1 h-4 w-4" /> Add Entry</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Section title & subtitle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Section Title (EN)</Label>
              <Input value={journeyTitleEn} onChange={(e) => setJourneyTitleEn(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Section Title (BN)</Label>
              <Input value={journeyTitleBn} onChange={(e) => setJourneyTitleBn(e.target.value)} className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Section Subtitle (EN)</Label>
              <Textarea value={journeySubEn} onChange={(e) => setJourneySubEn(e.target.value)} className="mt-1" rows={2} />
            </div>
            <div>
              <Label>Section Subtitle (BN)</Label>
              <Textarea value={journeySubBn} onChange={(e) => setJourneySubBn(e.target.value)} className="mt-1" rows={2} />
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="p-4 rounded-lg border bg-secondary/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveTimeline(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs">▲</button>
                      <button onClick={() => moveTimeline(i, 1)} disabled={i === timeline.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs">▼</button>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Entry #{i + 1}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeTimeline(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  <div>
                    <Label className="text-xs">Year</Label>
                    <Input value={item.year} onChange={(e) => updateTimeline(i, "year", e.target.value)} className="mt-1" placeholder="2024" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Title (EN)</Label>
                    <Input value={item.title} onChange={(e) => updateTimeline(i, "title", e.target.value)} className="mt-1" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Title (BN)</Label>
                    <Input value={item.title_bn} onChange={(e) => updateTimeline(i, "title_bn", e.target.value)} className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Description (EN)</Label>
                    <Textarea value={item.desc} onChange={(e) => updateTimeline(i, "desc", e.target.value)} className="mt-1" rows={2} />
                  </div>
                  <div>
                    <Label className="text-xs">Description (BN)</Label>
                    <Textarea value={item.desc_bn} onChange={(e) => updateTimeline(i, "desc_bn", e.target.value)} className="mt-1" rows={2} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutManager;
