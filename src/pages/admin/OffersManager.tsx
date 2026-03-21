import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const defaultForm = { title: "", title_bn: "", description: "", description_bn: "", image_url: "", expiry_date: "", active: true, type: "offer" as string };

const OffersManager = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("offers").select("*").order("created_at", { ascending: false });
    setOffers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit = (o: any) => { setEditing(o); setForm({ title: o.title, title_bn: o.title_bn || "", description: o.description || "", description_bn: o.description_bn || "", image_url: o.image_url || "", expiry_date: o.expiry_date || "", active: o.active, type: o.type }); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      await supabase.from("offers").update(form).eq("id", editing.id);
    } else {
      await supabase.from("offers").insert(form);
    }
    setSaving(false);
    setDialogOpen(false);
    toast({ title: editing ? "Offer updated" : "Offer created" });
    fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("offers").delete().eq("id", id);
    toast({ title: "Offer deleted" });
    fetch();
  };

  const toggleActive = async (o: any) => {
    await supabase.from("offers").update({ active: !o.active }).eq("id", o.id);
    fetch();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Offers Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add Offer</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Offer" : "Add Offer"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title (EN)</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><Label>Title (BN)</Label><Input value={form.title_bn} onChange={e => setForm({...form, title_bn: e.target.value})} /></div>
              <div><Label>Description (EN)</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div><Label>Description (BN)</Label><Textarea value={form.description_bn} onChange={e => setForm({...form, description_bn: e.target.value})} /></div>
              <div><Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="coupon">Coupon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} /></div>
              <div><Label>Expiry Date</Label><Input type="date" value={form.expiry_date} onChange={e => setForm({...form, expiry_date: e.target.value})} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({...form, active: v})} /><Label>Active</Label></div>
              <Button onClick={handleSave} disabled={saving || !form.title} className="w-full">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader><TableRow>
          <TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Expiry</TableHead><TableHead>Active</TableHead><TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {offers.map(o => (
            <TableRow key={o.id}>
              <TableCell className="font-medium">{o.title}</TableCell>
              <TableCell>{o.type}</TableCell>
              <TableCell>{o.expiry_date || "—"}</TableCell>
              <TableCell><Switch checked={o.active} onCheckedChange={() => toggleActive(o)} /></TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(o)}><Pencil className="h-4 w-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Delete offer?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(o.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {offers.length === 0 && <p className="text-center text-muted-foreground py-8">No offers yet.</p>}
    </div>
  );
};

export default OffersManager;
