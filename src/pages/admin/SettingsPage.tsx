import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Upload, Trash2, FileText } from "lucide-react";
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
  { key: "whatsapp_number", label: "WhatsApp Number (e.g. 8801646078000)" },
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

const contactKeys = [
  { key: "contact_phone_1", label: "Phone 1" },
  { key: "contact_phone_2", label: "Phone 2" },
  { key: "contact_email_1", label: "Email 1" },
  { key: "contact_email_2", label: "Email 2" },
  { key: "contact_address_en", label: "Address (EN)" },
  { key: "contact_address_bn", label: "Address (BN)" },
  { key: "contact_hours_en", label: "Business Hours (EN)" },
  { key: "contact_hours_bn", label: "Business Hours (BN)" },
  { key: "contact_friday_hours_en", label: "Friday Hours (EN)" },
  { key: "contact_friday_hours_bn", label: "Friday Hours (BN)" },
];

const aboutTextKeys = [
  { key: "about_hero_en", label: "About Hero Subtitle (EN)" },
  { key: "about_hero_bn", label: "About Hero Subtitle (BN)" },
];

const aboutJsonKeys = [
  { key: "about_stats", label: "Stats (JSON)", help: '[{"num":"10,000+","label":"Happy Customers","label_bn":"সন্তুষ্ট গ্রাহক","icon":"Users"}]' },
  { key: "about_timeline", label: "Timeline (JSON)", help: '[{"year":"2015","title":"Founded","title_bn":"প্রতিষ্ঠিত","desc":"Started...","desc_bn":"শুরু..."}]' },
];

const allKeys = [
  ...settingsKeys, ...topbarKeys, ...heroKeys, ...selfcareKeys,
  ...contactKeys, ...aboutTextKeys, ...aboutJsonKeys,
];

const SettingsPage = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Only PDF files allowed", variant: "destructive" });
      return;
    }
    setUploadingPdf(true);
    // Remove old file first (ignore errors)
    await supabase.storage.from("media").remove(["btrc-tariff.pdf"]);
    const { error } = await supabase.storage.from("media").upload("btrc-tariff.pdf", file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploadingPdf(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("media").getPublicUrl("btrc-tariff.pdf");
    const url = urlData.publicUrl;
    await supabase.from("site_settings").upsert({ key: "btrc_tariff_url", value: url }, { onConflict: "key" });
    setSettings(s => ({ ...s, btrc_tariff_url: url }));
    setUploadingPdf(false);
    toast({ title: "BTRC Tariff PDF uploaded!" });
    e.target.value = "";
  };

  const handlePdfDelete = async () => {
    await supabase.storage.from("media").remove(["btrc-tariff.pdf"]);
    await supabase.from("site_settings").upsert({ key: "btrc_tariff_url", value: "" }, { onConflict: "key" });
    setSettings(s => ({ ...s, btrc_tariff_url: "" }));
    toast({ title: "BTRC Tariff PDF removed" });
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

  const renderJsonSection = (title: string, textKeys: typeof aboutTextKeys, jsonKeys: typeof aboutJsonKeys) => (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {textKeys.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <Label>{label}</Label>
            <Input value={settings[key] ?? ""} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} />
          </div>
        ))}
        {jsonKeys.map(({ key, label, help }) => (
          <div key={key} className="space-y-1">
            <Label>{label}</Label>
            <Textarea
              value={settings[key] ?? ""}
              onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
              rows={5}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">Format: {help}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const btrcUrl = settings.btrc_tariff_url || "";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Site Settings</h2>
      {renderSection("General", settingsKeys)}
      {renderSection("Top Bar", topbarKeys)}
      {renderSection("Hero Section", heroKeys)}
      {renderSection("Selfcare Portal", selfcareKeys)}
      {renderSection("Contact Page", contactKeys)}
      {renderJsonSection("About Page", aboutTextKeys, aboutJsonKeys)}

      <Card>
        <CardHeader><CardTitle>BTRC Approved Tariff (PDF)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {btrcUrl ? (
            <div className="flex items-center gap-3">
              <a href={btrcUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                <FileText className="h-4 w-4" /> View Current PDF
              </a>
              <Button size="sm" variant="destructive" onClick={handlePdfDelete}>
                <Trash2 className="h-3 w-3 mr-1" /> Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF uploaded yet.</p>
          )}
          <div>
            <Input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" id="btrc-pdf-upload" />
            <Button asChild disabled={uploadingPdf} variant="outline">
              <label htmlFor="btrc-pdf-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" /> {uploadingPdf ? "Uploading..." : btrcUrl ? "Replace PDF" : "Upload PDF"}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} size="lg">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save All Settings
      </Button>
    </div>
  );
};

export default SettingsPage;
