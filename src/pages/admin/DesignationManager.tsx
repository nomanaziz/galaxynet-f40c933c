import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Designation {
  id: string;
  name: string;
  name_bn: string | null;
  sort_order: number;
}

const DesignationManager = () => {
  const [items, setItems] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Designation | null>(null);
  const [form, setForm] = useState({ name: "", name_bn: "", sort_order: 0 });
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("designations").select("*").order("sort_order");
    setItems((data as Designation[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(null); setForm({ name: "", name_bn: "", sort_order: 0 }); setOpen(true); };
  const openEdit = (d: Designation) => { setEditing(d); setForm({ name: d.name, name_bn: d.name_bn ?? "", sort_order: d.sort_order }); setOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (editing) {
      await supabase.from("designations").update({ name: form.name, name_bn: form.name_bn || null, sort_order: form.sort_order }).eq("id", editing.id);
    } else {
      await supabase.from("designations").insert({ name: form.name, name_bn: form.name_bn || null, sort_order: form.sort_order });
    }
    setOpen(false);
    toast({ title: editing ? "Designation updated" : "Designation added" });
    fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("designations").delete().eq("id", id);
    toast({ title: "Designation deleted" });
    fetch();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Designations</h2>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Designation</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Name (BN)</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.name_bn}</TableCell>
                  <TableCell>{d.sort_order}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(d)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(d.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Designation" : "Add Designation"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name (EN)</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Name (BN)</Label><Input value={form.name_bn} onChange={e => setForm(f => ({ ...f, name_bn: e.target.value }))} /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} /></div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DesignationManager;
