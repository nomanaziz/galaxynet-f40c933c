import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const settingsKeys = [
  { key: "website_name", label: "Website Name" },
  { key: "tagline", label: "Tagline" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address (EN)" },
  { key: "address_bn", label: "Address (BN)" },
  { key: "facebook", label: "Facebook URL" },
  { key: "hotline", label: "Hotline Number" },
  { key: "maintenance_mode", label: "Maintenance Mode (true/false)" },
];

const topbarKeys = [
  { key: "topbar_notice_en", label: "Top Bar Notice (EN)" },
  { key: "topbar_notice_bn", label: "Top Bar Notice (BN)" },
];

const heroKeys = [
  { key: "hero_banner_url", label: "Hero Banner Image URL" },
  { key: "hero_title_en", label: "Hero Title (EN)" },
  { key: "hero_title_bn", label: "Hero Title (BN)" },
  { key: "hero_subtitle_en", label: "Hero Subtitle (EN)" },
  { key: "hero_subtitle_bn", label: "Hero Subtitle (BN)" },
  { key: "hero_cta_text_en", label: "Hero CTA Text (EN)" },
  { key: "hero_cta_text_bn", label: "Hero CTA Text (BN)" },
  { key: "hero_cta_url", label: "Hero CTA URL" },
];

const selfcareKeys = [
  { key: "selfcare_url", label: "Selfcare Portal URL" },
  { key: "selfcare_enabled", label: "Selfcare Enabled (true/false)" },
];

const allKeys = [...settingsKeys, ...topbarKeys, ...heroKeys, ...selfcareKeys];

const SettingsPage = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, string> = {};
      (data ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
      setSettings(map);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const { key } of allKeys) {
      const val = settings[key] ?? "";
      await supabase.from("site_settings").upsert({ key, value: val }, { onConflict: "key" });
    }
    setSaving(false);
    toast({ title: "Settings saved" });
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const renderSection = (title: string, keys: typeof settingsKeys) => (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {keys.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <Label>{label}</Label>
            <Input value={settings[key] ?? ""} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Site Settings</h2>
      {renderSection("General", settingsKeys)}
      {renderSection("Top Bar", topbarKeys)}
      {renderSection("Hero Section", heroKeys)}
      {renderSection("Selfcare Portal", selfcareKeys)}
      <Button onClick={handleSave} disabled={saving} size="lg">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save All Settings
      </Button>
    </div>
  );
};

export default SettingsPage;
