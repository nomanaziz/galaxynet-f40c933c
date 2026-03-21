import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const settingsKeys = [
  { key: "hero_title_en", label: "Hero Title (EN)", placeholder: "Best Fiber Internet in Your Area" },
  { key: "hero_title_bn", label: "Hero Title (BN)", placeholder: "আপনার এলাকায় সেরা ফাইবার ইন্টারনেট" },
  { key: "hero_description_en", label: "Hero Description (EN)", placeholder: "Bangladesh's trusted ISP..." },
  { key: "hero_description_bn", label: "Hero Description (BN)", placeholder: "বাংলাদেশের বিশ্বস্ত ISP..." },
  { key: "hero_cta_text_en", label: "Hero CTA Text (EN)", placeholder: "Check Coverage" },
  { key: "hero_cta_text_bn", label: "Hero CTA Text (BN)", placeholder: "কভারেজ চেক" },
  { key: "hero_cta_url", label: "Hero CTA URL", placeholder: "/coverage" },
];

const HomepageEditor = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["site_settings_homepage"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").in("key", settingsKeys.map(s => s.key));
      if (error) throw error;
      const map: Record<string, string> = {};
      data.forEach((s: any) => { map[s.key] = s.value || ""; });
      setValues(map);
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(values)) {
        const existing = settings.find((s: any) => s.key === key);
        if (existing) {
          await supabase.from("site_settings").update({ value }).eq("key", key);
        } else {
          await supabase.from("site_settings").insert({ key, value });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings_homepage"] });
      toast({ title: "Homepage settings saved!" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Homepage Editor</h1>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? "Saving..." : "Save All"}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {settingsKeys.map((s) => (
            <div key={s.key}>
              <Label>{s.label}</Label>
              {s.key.includes("description") ? (
                <Textarea
                  value={values[s.key] || ""}
                  onChange={(e) => setValues({ ...values, [s.key]: e.target.value })}
                  placeholder={s.placeholder}
                  className="mt-1"
                />
              ) : (
                <Input
                  value={values[s.key] || ""}
                  onChange={(e) => setValues({ ...values, [s.key]: e.target.value })}
                  placeholder={s.placeholder}
                  className="mt-1"
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomepageEditor;
