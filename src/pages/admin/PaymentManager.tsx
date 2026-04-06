import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Settings } from "lucide-react";

const CATEGORIES = [
  { value: "mobile_banking", label: "Mobile Banking" },
  { value: "online_payment", label: "Online Payment" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "ussd", label: "USSD Code" },
];

const emptyForm = {
  name: "", name_bn: "", account_number: "", instructions: "", instructions_bn: "",
  logo_url: "", sort_order: 0, visible: true, button_text: "", button_text_bn: "",
  button_url: "", bg_color: "#3B82F6", screenshot_url: "", category: "mobile_banking",
  video_url: "",
};

const SETTINGS_KEYS = [
  "payment_portal_url", "payment_hero_title", "payment_hero_title_bn",
  "payment_hero_subtitle", "payment_hero_subtitle_bn",
  "payment_helpline_text", "payment_helpline_text_bn",
];

const PaymentManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [uploading, setUploading] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);

  const { data: methods = [] } = useQuery({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payment_methods").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  // Load page settings
  useEffect(() => {
    supabase.from("site_settings").select("key, value").in("key", SETTINGS_KEYS).then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
      setPageSettings(map);
    });
  }, []);

  const saveSettings = async () => {
    setSavingSettings(true);
    for (const key of SETTINGS_KEYS) {
      const value = pageSettings[key] || "";
      await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
    }
    setSavingSettings(false);
    toast({ title: "Page settings saved!" });
  };

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
      screenshot_url: item.screenshot_url || "", category: item.category || "mobile_banking",
      video_url: item.video_url || "",
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
      <h1 className="text-2xl font-bold">Payment Methods</h1>

      <Tabs defaultValue="methods">
        <TabsList>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-1" /> Page Settings</TabsTrigger>
        </TabsList>

        {/* Page Settings Tab */}
        <TabsContent value="settings" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div className="col-span-2">
              <Label>Quick Pay Portal URL</Label>
              <Input value={pageSettings.payment_portal_url || ""} onChange={(e) => setPageSettings(s => ({ ...s, payment_portal_url: e.target.value }))} className="mt-1" placeholder="https://portal.galaxynetbd.com/BillPayment/Index" />
            </div>
            <div><Label>Hero Title (EN)</Label><Input value={pageSettings.payment_hero_title || ""} onChange={(e) => setPageSettings(s => ({ ...s, payment_hero_title: e.target.value }))} className="mt-1" placeholder="Quick Pay" /></div>
            <div><Label>Hero Title (BN)</Label><Input value={pageSettings.payment_hero_title_bn || ""} onChange={(e) => setPageSettings(s => ({ ...s, payment_hero_title_bn: e.target.value }))} className="mt-1" placeholder="কুইক পে" /></div>
            <div className="col-span-2"><Label>Hero Subtitle (EN)</Label><Textarea value={pageSettings.payment_hero_subtitle || ""} onChange={(e) => setPageSettings(s => ({ ...s, payment_hero_subtitle: e.target.value }))} className="mt-1" /></div>
            <div className="col-span-2"><Label>Hero Subtitle (BN)</Label><Textarea value={pageSettings.payment_hero_subtitle_bn || ""} onChange={(e) => setPageSettings(s => ({ ...s, payment_hero_subtitle_bn: e.target.value }))} className="mt-1" /></div>
            <div className="col-span-2"><Label>Helpline/Disclaimer Text (EN)</Label><Textarea value={pageSettings.payment_helpline_text || ""} onChange={(e) => setPageSettings(s => ({ ...s, payment_helpline_text: e.target.value }))} className="mt-1" /></div>
            <div className="col-span-2"><Label>Helpline/Disclaimer Text (BN)</Label><Textarea value={pageSettings.payment_helpline_text_bn || ""} onChange={(e) => setPageSettings(s => ({ ...s, payment_helpline_text_bn: e.target.value }))} className="mt-1" /></div>
          </div>
          <Button onClick={saveSettings} disabled={savingSettings}>{savingSettings ? "Saving..." : "Save Settings"}</Button>
        </TabsContent>

        {/* Methods Tab */}
        <TabsContent value="methods" className="mt-4">
          <div className="flex justify-end mb-4">
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
                  <div>
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Account Number</Label><Input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} className="mt-1" /></div>
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="color" value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} className="w-14 h-10 p-1 cursor-pointer" />
                      <Input value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} className="flex-1" placeholder="#E2136E" />
                    </div>
                  </div>
                  <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
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

                  <div><Label>Button Text (EN)</Label><Input value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} className="mt-1" /></div>
                  <div><Label>Button Text (BN)</Label><Input value={form.button_text_bn} onChange={(e) => setForm({ ...form, button_text_bn: e.target.value })} className="mt-1" /></div>
                  <div><Label>Button URL</Label><Input value={form.button_url} onChange={(e) => setForm({ ...form, button_url: e.target.value })} className="mt-1" placeholder="https://..." /></div>
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
                <TableHead>Category</TableHead>
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
                  <TableCell>
                    <span className="text-xs bg-muted px-2 py-1 rounded">{CATEGORIES.find(c => c.value === m.category)?.label || m.category}</span>
                  </TableCell>
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
