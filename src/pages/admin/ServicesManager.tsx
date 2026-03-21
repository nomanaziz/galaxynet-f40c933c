import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const defaultForm = {
  title: "", title_bn: "", description: "", description_bn: "",
  icon_name: "wifi", badge: "", badge_bn: "", link: "/contact",
  features: "[]", sort_order: 0, visible: true,
};

const ServicesManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit = (o: any) => {
    setEditing(o);
    setForm({
      title: o.title, title_bn: o.title_bn || "", description: o.description || "",
      description_bn: o.description_bn || "", icon_name: o.icon_name, badge: o.badge || "",
      badge_bn: o.badge_bn || "", link: o.link || "/contact",
      features: JSON.stringify(o.features || [], null, 2),
      sort_order: o.sort_order, visible: o.visible,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    let parsedFeatures: any[];
    try {
      parsedFeatures = JSON.parse(form.features);
    } catch {
      toast({ title: "Invalid JSON in features", variant: "destructive" });
      setSaving(false);
      return;
    }
    const payload = {
      ...form,
      features: parsedFeatures,
      badge: form.badge || null,
      badge_bn: form.badge_bn || null,
    };
    if (editing) await supabase.from("services").update(payload).eq("id", editing.id);
    else await supabase.from("services").insert(payload);
    setSaving(false);
    setDialogOpen(false);
    toast({ title: editing ? "Updated" : "Created" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchData();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Services</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add Service</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Service</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title (EN)</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Title (BN)</Label><Input value={form.title_bn} onChange={e => setForm({ ...form, title_bn: e.target.value })} /></div>
              <div><Label>Description (EN)</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Description (BN)</Label><Textarea value={form.description_bn} onChange={e => setForm({ ...form, description_bn: e.target.value })} /></div>
              <div><Label>Icon Name</Label><Input value={form.icon_name} onChange={e => setForm({ ...form, icon_name: e.target.value })} placeholder="wifi, building-2, server, camera, network" /></div>
              <div><Label>Badge (EN)</Label><Input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Most Popular" /></div>
              <div><Label>Badge (BN)</Label><Input value={form.badge_bn} onChange={e => setForm({ ...form, badge_bn: e.target.value })} /></div>
              <div><Label>Link</Label><Input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="/packages or /contact" /></div>
              <div>
                <Label>Features (JSON)</Label>
                <Textarea rows={5} value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder='[{"en":"Feature","bn":"ফিচার"}]' />
                <p className="text-xs text-muted-foreground mt-1">Array of {`{"en":"...", "bn":"..."}`} objects</p>
              </div>
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.visible} onCheckedChange={v => setForm({ ...form, visible: v })} /><Label>Visible</Label></div>
              <Button onClick={handleSave} disabled={saving || !form.title} className="w-full">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader><TableRow>
          <TableHead>Icon</TableHead><TableHead>Title</TableHead><TableHead>Badge</TableHead><TableHead>Link</TableHead><TableHead>Order</TableHead><TableHead>Visible</TableHead><TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {items.map(o => (
            <TableRow key={o.id}>
              <TableCell>{o.icon_name}</TableCell>
              <TableCell className="font-medium">{o.title}</TableCell>
              <TableCell>{o.badge || "—"}</TableCell>
              <TableCell>{o.link}</TableCell>
              <TableCell>{o.sort_order}</TableCell>
              <TableCell><Switch checked={o.visible} onCheckedChange={async () => { await supabase.from("services").update({ visible: !o.visible }).eq("id", o.id); fetchData(); }} /></TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(o)}><Pencil className="h-4 w-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(o.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {items.length === 0 && <p className="text-center text-muted-foreground py-8">No services yet.</p>}
    </div>
  );
};

export default ServicesManager;
