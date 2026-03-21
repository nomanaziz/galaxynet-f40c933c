import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  name_bn: string | null;
  sort_order: number;
  visible: boolean;
}

const DepartmentManager = () => {
  const [items, setItems] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: "", name_bn: "", sort_order: 0, visible: true });
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("departments").select("*").order("sort_order");
    setItems((data as Department[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(null); setForm({ name: "", name_bn: "", sort_order: 0, visible: true }); setOpen(true); };
  const openEdit = (d: Department) => { setEditing(d); setForm({ name: d.name, name_bn: d.name_bn ?? "", sort_order: d.sort_order, visible: d.visible }); setOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (editing) {
      await supabase.from("departments").update({ name: form.name, name_bn: form.name_bn || null, sort_order: form.sort_order, visible: form.visible }).eq("id", editing.id);
    } else {
      await supabase.from("departments").insert({ name: form.name, name_bn: form.name_bn || null, sort_order: form.sort_order, visible: form.visible });
    }
    setOpen(false);
    toast({ title: editing ? "Department updated" : "Department added" });
    fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("departments").delete().eq("id", id);
    toast({ title: "Department deleted" });
    fetch();
  };

  const toggleVisible = async (d: Department) => {
    await supabase.from("departments").update({ visible: !d.visible }).eq("id", d.id);
    fetch();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Departments</h2>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Department</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Name (BN)</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.name_bn}</TableCell>
                  <TableCell>{d.sort_order}</TableCell>
                  <TableCell><Switch checked={d.visible} onCheckedChange={() => toggleVisible(d)} /></TableCell>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Department" : "Add Department"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name (EN)</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Name (BN)</Label><Input value={form.name_bn} onChange={e => setForm(f => ({ ...f, name_bn: e.target.value }))} /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.visible} onCheckedChange={v => setForm(f => ({ ...f, visible: v }))} /><Label>Visible</Label></div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentManager;
