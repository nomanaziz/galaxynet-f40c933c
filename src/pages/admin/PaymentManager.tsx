import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Settings, CreditCard, Save, Loader2 } from "lucide-react";

const SETTING_KEYS = [
  "payment_portal_url",
  "payment_hero_title",
  "payment_hero_title_bn",
  "payment_hero_subtitle",
  "payment_hero_subtitle_bn",
  "payment_quick_pay_enabled",
] as const;

const emptyForm = {
  name: "", name_bn: "", account_number: "", instructions: "", instructions_bn: "",
  logo_url: "", sort_order: 0, visible: true, button_text: "", button_text_bn: "",
  button_url: "", bg_color: "#3B82F6", screenshot_url: "",
};

const PaymentManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [uploading, setUploading] = useState<string | null>(null);

  // Settings state
  const [pageSettings, setPageSettings] = useState<Record<string, string>>({
    payment_portal_url: "https://portal.galaxynetbd.com/BillPayment/Index",
    payment_hero_title: "Pay Bill",
    payment_hero_title_bn: "বিল পরিশোধ",
    payment_hero_subtitle: "Quick and secure bill payment options for Galaxy Net subscribers.",
    payment_hero_subtitle_bn: "গ্যালাক্সি নেট গ্রাহকদের জন্য দ্রুত ও নিরাপদ বিল পরিশোধের অপশন।",
    payment_quick_pay_enabled: "true",
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("key, value").in("key", [...SETTING_KEYS]).then(({ data }) => {
      if (data) {
        const map = { ...pageSettings };
        data.forEach((s: any) => { if (s.value) map[s.key] = s.value; });
        setPageSettings(map);
      }
      setSettingsLoading(false);
    });
  }, []);

  const saveSettings = async () => {
    setSavingSettings(true);
    for (const key of SETTING_KEYS) {
      const value = pageSettings[key] ?? "";
      const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).maybeSingle();
      if (existing) {
        await supabase.from("site_settings").update({ value }).eq("key", key);
      } else {
        await supabase.from("site_settings").insert({ key, value });
      }
    }
    setSavingSettings(false);
    toast({ title: "Settings saved!" });
  };

  const { data: methods = [] } = useQuery({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payment_methods").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const sanitize = (item: typeof form) => ({
    ...item,
    name_bn: item.name_bn || null,
    account_number: item.account_number || null,
    instructions: item.instructions || null,
    instructions_bn: item.instructions_bn || null,
    logo_url: item.logo_url || null,
    button_text: item.button_text || null,
    button_text_bn: item.button_text_bn || null,
    button_url: item.button_url || null,
    bg_color: item.bg_color || null,
    screenshot_url: item.screenshot_url || null,
  });

  const saveMutation = useMutation({
    mutationFn: async (item: typeof form & { id?: string }) => {
      const clean = sanitize(item);
      if (item.id) {
        const { error } = await supabase.from("payment_methods").update(clean).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("payment_methods").insert(clean);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_methods"] });
      toast({ title: "Saved!" });
      closeDialog();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payment_methods").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_methods"] });
      toast({ title: "Deleted!" });
    },
  });

  const closeDialog = () => { setDialogOpen(false); setEditing(null); setForm({ ...emptyForm }); };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      name: item.name || "", name_bn: item.name_bn || "",
      account_number: item.account_number || "", instructions: item.instructions || "",
      instructions_bn: item.instructions_bn || "", logo_url: item.logo_url || "",
      sort_order: item.sort_order, visible: item.visible,
      button_text: item.button_text || "", button_text_bn: item.button_text_bn || "",
      button_url: item.button_url || "", bg_color: item.bg_color || "#3B82F6",
      screenshot_url: item.screenshot_url || "",
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo_url" | "screenshot_url") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${field}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setForm((f) => ({ ...f, [field]: data.publicUrl }));
    }
    setUploading(null);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pay Bill Manager</h1>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> Page Settings</TabsTrigger>
          <TabsTrigger value="methods" className="gap-2"><CreditCard className="h-4 w-4" /> Payment Methods</TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Pay Bill Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Hero Title (EN)</Label>
                      <Input className="mt-1" value={pageSettings.payment_hero_title} onChange={(e) => setPageSettings(s => ({ ...s, payment_hero_title: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Hero Title (BN)</Label>
                      <Input className="mt-1" value={pageSettings.payment_hero_title_bn} onChange={(e) => setPageSettings(s => ({ ...s, payment_hero_title_bn: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Hero Subtitle (EN)</Label>
                      <Textarea className="mt-1" value={pageSettings.payment_hero_subtitle} onChange={(e) => setPageSettings(s => ({ ...s, payment_hero_subtitle: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Hero Subtitle (BN)</Label>
                      <Textarea className="mt-1" value={pageSettings.payment_hero_subtitle_bn} onChange={(e) => setPageSettings(s => ({ ...s, payment_hero_subtitle_bn: e.target.value }))} />
                    </div>
                  </div>

                  <div>
                    <Label>Quick Bill Pay Portal URL</Label>
                    <Input className="mt-1" value={pageSettings.payment_portal_url} onChange={(e) => setPageSettings(s => ({ ...s, payment_portal_url: e.target.value }))} placeholder="https://portal.galaxynetbd.com/BillPayment/Index" />
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={pageSettings.payment_quick_pay_enabled === "true"}
                      onCheckedChange={(v) => setPageSettings(s => ({ ...s, payment_quick_pay_enabled: v ? "true" : "false" }))}
                    />
                    <Label>Enable Quick Bill Pay Section</Label>
                  </div>

                  <Button onClick={saveSettings} disabled={savingSettings} className="gap-2">
                    {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Settings
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Methods Tab */}
        <TabsContent value="methods">
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">Manage payment method cards shown on the Pay Bill page.</p>
            <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) closeDialog(); else setDialogOpen(true); }}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Method</Button></DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit Payment Method" : "Add Payment Method"}</DialogTitle>
                  <DialogDescription>Fill in the payment method details below.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Name (EN)</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" placeholder="bKash" /></div>
                  <div><Label>Name (BN)</Label><Input value={form.name_bn} onChange={(e) => setForm({ ...form, name_bn: e.target.value })} className="mt-1" placeholder="বিকাশ" /></div>
                  <div><Label>Account Number</Label><Input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} className="mt-1" /></div>
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="color" value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} className="w-14 h-10 p-1 cursor-pointer" />
                      <Input value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} className="flex-1" placeholder="#E2136E" />
                    </div>
                  </div>
                  <div className="col-span-2"><Label>Instructions (EN)</Label><Textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} className="mt-1" /></div>
                  <div className="col-span-2"><Label>Instructions (BN)</Label><Textarea value={form.instructions_bn} onChange={(e) => setForm({ ...form, instructions_bn: e.target.value })} className="mt-1" /></div>

                  <div>
                    <Label>Logo</Label>
                    <div className="mt-1 space-y-2">
                      {form.logo_url && <img src={form.logo_url} alt="" className="h-12 w-12 object-contain rounded border" />}
                      <div className="flex gap-2">
                        <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} placeholder="URL or upload" className="flex-1" />
                        <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo_url")} className="hidden" id="logo-upload" />
                        <Button variant="outline" size="sm" asChild disabled={uploading === "logo_url"}>
                          <label htmlFor="logo-upload" className="cursor-pointer"><Upload className="h-4 w-4" /></label>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Screenshot</Label>
                    <div className="mt-1 space-y-2">
                      {form.screenshot_url && <img src={form.screenshot_url} alt="" className="h-12 w-20 object-contain rounded border" />}
                      <div className="flex gap-2">
                        <Input value={form.screenshot_url} onChange={(e) => setForm({ ...form, screenshot_url: e.target.value })} placeholder="URL or upload" className="flex-1" />
                        <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "screenshot_url")} className="hidden" id="screenshot-upload" />
                        <Button variant="outline" size="sm" asChild disabled={uploading === "screenshot_url"}>
                          <label htmlFor="screenshot-upload" className="cursor-pointer"><Upload className="h-4 w-4" /></label>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div><Label>Button Text (EN)</Label><Input value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} className="mt-1" placeholder="Learn More" /></div>
                  <div><Label>Button Text (BN)</Label><Input value={form.button_text_bn} onChange={(e) => setForm({ ...form, button_text_bn: e.target.value })} className="mt-1" placeholder="বিস্তারিত জানুন" /></div>
                  <div><Label>Button URL</Label><Input value={form.button_url} onChange={(e) => setForm({ ...form, button_url: e.target.value })} className="mt-1" placeholder="https://..." /></div>
                  <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
                  <div className="flex items-center gap-2"><Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} /><Label>Visible</Label></div>
                </div>
                <Button className="w-full mt-4" onClick={() => saveMutation.mutate(editing ? { ...form, id: editing.id } : form)} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell>
                    {m.logo_url ? <img src={m.logo_url} alt="" className="h-8 w-8 object-contain rounded" /> : <span className="text-muted-foreground text-xs">—</span>}
                  </TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-muted-foreground">{m.account_number}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded border" style={{ backgroundColor: m.bg_color || "#3B82F6" }} />
                      <span className="text-xs text-muted-foreground">{m.bg_color}</span>
                    </div>
                  </TableCell>
                  <TableCell><Switch checked={m.visible} onCheckedChange={(v) => saveMutation.mutate({ ...m, visible: v })} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(m.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentManager;
