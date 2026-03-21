import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const defaultForm = { name: "", name_bn: "", location: "", location_bn: "", rating: 5, text: "", text_bn: "", visible: true, sort_order: 0 };

const TestimonialsManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit = (o: any) => { setEditing(o); setForm({ name: o.name, name_bn: o.name_bn || "", location: o.location || "", location_bn: o.location_bn || "", rating: o.rating, text: o.text || "", text_bn: o.text_bn || "", visible: o.visible, sort_order: o.sort_order }); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editing) await supabase.from("testimonials").update(form).eq("id", editing.id);
    else await supabase.from("testimonials").insert(form);
    setSaving(false); setDialogOpen(false);
    toast({ title: editing ? "Updated" : "Created" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Testimonials</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Testimonial</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name (EN)</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><Label>Name (BN)</Label><Input value={form.name_bn} onChange={e => setForm({...form, name_bn: e.target.value})} /></div>
              <div><Label>Location (EN)</Label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
              <div><Label>Location (BN)</Label><Input value={form.location_bn} onChange={e => setForm({...form, location_bn: e.target.value})} /></div>
              <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value) || 5})} /></div>
              <div><Label>Review Text (EN)</Label><Textarea value={form.text} onChange={e => setForm({...form, text: e.target.value})} /></div>
              <div><Label>Review Text (BN)</Label><Textarea value={form.text_bn} onChange={e => setForm({...form, text_bn: e.target.value})} /></div>
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.visible} onCheckedChange={v => setForm({...form, visible: v})} /><Label>Visible</Label></div>
              <Button onClick={handleSave} disabled={saving || !form.name} className="w-full">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader><TableRow>
          <TableHead>Name</TableHead><TableHead>Location</TableHead><TableHead>Rating</TableHead><TableHead>Visible</TableHead><TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {items.map(o => (
            <TableRow key={o.id}>
              <TableCell className="font-medium">{o.name}</TableCell>
              <TableCell>{o.location || "—"}</TableCell>
              <TableCell><div className="flex">{Array.from({length: o.rating}).map((_, i) => <Star key={i} className="h-3 w-3 fill-accent text-accent" />)}</div></TableCell>
              <TableCell><Switch checked={o.visible} onCheckedChange={async () => { await supabase.from("testimonials").update({ visible: !o.visible }).eq("id", o.id); fetchData(); }} /></TableCell>
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
      {items.length === 0 && <p className="text-center text-muted-foreground py-8">No testimonials yet.</p>}
    </div>
  );
};

export default TestimonialsManager;
