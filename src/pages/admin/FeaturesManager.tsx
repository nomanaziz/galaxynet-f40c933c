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

const defaultForm = { icon_name: "star", title: "", title_bn: "", description: "", description_bn: "", sort_order: 0, visible: true };

const FeaturesManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("homepage_features").select("*").order("sort_order");
    setItems(data ?? []); setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit = (o: any) => { setEditing(o); setForm({ icon_name: o.icon_name, title: o.title, title_bn: o.title_bn || "", description: o.description || "", description_bn: o.description_bn || "", sort_order: o.sort_order, visible: o.visible }); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editing) await supabase.from("homepage_features").update(form).eq("id", editing.id);
    else await supabase.from("homepage_features").insert(form);
    setSaving(false); setDialogOpen(false);
    toast({ title: editing ? "Updated" : "Created" }); fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("homepage_features").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Homepage Features</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add Feature</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Feature</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Icon Name</Label><Input value={form.icon_name} onChange={e => setForm({...form, icon_name: e.target.value})} placeholder="zap, shield, wifi, headphones, gauge, banknote" /></div>
              <div><Label>Title (EN)</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><Label>Title (BN)</Label><Input value={form.title_bn} onChange={e => setForm({...form, title_bn: e.target.value})} /></div>
              <div><Label>Description (EN)</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div><Label>Description (BN)</Label><Textarea value={form.description_bn} onChange={e => setForm({...form, description_bn: e.target.value})} /></div>
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.visible} onCheckedChange={v => setForm({...form, visible: v})} /><Label>Visible</Label></div>
              <Button onClick={handleSave} disabled={saving || !form.title} className="w-full">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader><TableRow>
          <TableHead>Icon</TableHead><TableHead>Title</TableHead><TableHead>Order</TableHead><TableHead>Visible</TableHead><TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {items.map(o => (
            <TableRow key={o.id}>
              <TableCell>{o.icon_name}</TableCell>
              <TableCell className="font-medium">{o.title}</TableCell>
              <TableCell>{o.sort_order}</TableCell>
              <TableCell><Switch checked={o.visible} onCheckedChange={async () => { await supabase.from("homepage_features").update({ visible: !o.visible }).eq("id", o.id); fetchData(); }} /></TableCell>
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
      {items.length === 0 && <p className="text-center text-muted-foreground py-8">No features yet.</p>}
    </div>
  );
};

export default FeaturesManager;
