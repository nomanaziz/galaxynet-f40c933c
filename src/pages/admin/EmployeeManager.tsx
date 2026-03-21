import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  name_bn: string | null;
  department_id: string | null;
  designation_id: string | null;
  phone: string | null;
  email: string | null;
  photo_url: string | null;
  sort_order: number;
  visible: boolean;
  show_on_about: boolean;
  departments?: { name: string } | null;
  designations?: { name: string } | null;
}

interface Dept { id: string; name: string; }
interface Desig { id: string; name: string; }

const EmployeeManager = () => {
  const [items, setItems] = useState<Employee[]>([]);
  const [depts, setDepts] = useState<Dept[]>([]);
  const [desigs, setDesigs] = useState<Desig[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState({
    name: "", name_bn: "", department_id: "", designation_id: "",
    phone: "", email: "", photo_url: "", sort_order: 0, visible: true, show_on_about: false,
  });
  const { toast } = useToast();

  const fetchAll = async () => {
    const [empRes, deptRes, desigRes] = await Promise.all([
      supabase.from("employees").select("*, departments(name), designations(name)").order("sort_order"),
      supabase.from("departments").select("id, name").order("sort_order"),
      supabase.from("designations").select("id, name").order("sort_order"),
    ]);
    setItems((empRes.data as Employee[]) ?? []);
    setDepts((deptRes.data as Dept[]) ?? []);
    setDesigs((desigRes.data as Desig[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", name_bn: "", department_id: "", designation_id: "", phone: "", email: "", photo_url: "", sort_order: 0, visible: true, show_on_about: false });
    setOpen(true);
  };

  const openEdit = (e: Employee) => {
    setEditing(e);
    setForm({
      name: e.name, name_bn: e.name_bn ?? "", department_id: e.department_id ?? "",
      designation_id: e.designation_id ?? "", phone: e.phone ?? "", email: e.email ?? "",
      photo_url: e.photo_url ?? "", sort_order: e.sort_order, visible: e.visible, show_on_about: e.show_on_about,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const payload = {
      name: form.name, name_bn: form.name_bn || null,
      department_id: form.department_id || null, designation_id: form.designation_id || null,
      phone: form.phone || null, email: form.email || null, photo_url: form.photo_url || null,
      sort_order: form.sort_order, visible: form.visible, show_on_about: form.show_on_about,
    };
    if (editing) {
      await supabase.from("employees").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("employees").insert(payload);
    }
    setOpen(false);
    toast({ title: editing ? "Employee updated" : "Employee added" });
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("employees").delete().eq("id", id);
    toast({ title: "Employee deleted" });
    fetchAll();
  };

  const toggleAbout = async (e: Employee) => {
    await supabase.from("employees").update({ show_on_about: !e.show_on_about }).eq("id", e.id);
    fetchAll();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Employees</h2>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Employee</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>About Page</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    {e.photo_url ? (
                      <img src={e.photo_url} alt={e.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"><User className="h-5 w-5 text-muted-foreground" /></div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell>{e.departments?.name && <Badge variant="secondary">{e.departments.name}</Badge>}</TableCell>
                  <TableCell>{e.designations?.name ?? "—"}</TableCell>
                  <TableCell>{e.phone ?? "—"}</TableCell>
                  <TableCell><Switch checked={e.show_on_about} onCheckedChange={() => toggleAbout(e)} /></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Employee" : "Add Employee"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name (EN)</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Name (BN)</Label><Input value={form.name_bn} onChange={e => setForm(f => ({ ...f, name_bn: e.target.value }))} /></div>
            <div>
              <Label>Department</Label>
              <Select value={form.department_id} onValueChange={v => setForm(f => ({ ...f, department_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>{depts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Designation</Label>
              <Select value={form.designation_id} onValueChange={v => setForm(f => ({ ...f, designation_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select designation" /></SelectTrigger>
                <SelectContent>{desigs.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div><Label>Photo URL</Label><Input value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} placeholder="https://..." /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} /></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Switch checked={form.visible} onCheckedChange={v => setForm(f => ({ ...f, visible: v }))} /><Label>Visible</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.show_on_about} onCheckedChange={v => setForm(f => ({ ...f, show_on_about: v }))} /><Label>Show on About</Label></div>
            </div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManager;
