import { useEffect, useState, useRef } from "react";
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
import { Loader2, Plus, Pencil, Trash2, User, Upload, X, ArrowUp, ArrowDown } from "lucide-react";
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

interface Dept { id: string; name: string; sort_order: number; }
interface Desig { id: string; name: string; }

const EmployeeManager = () => {
  const [items, setItems] = useState<Employee[]>([]);
  const [depts, setDepts] = useState<Dept[]>([]);
  const [desigs, setDesigs] = useState<Desig[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "", name_bn: "", department_id: "", designation_id: "",
    phone: "", email: "", photo_url: "", sort_order: 0, visible: true, show_on_about: false,
  });
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", description: "Please upload an image file", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `employees/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    setForm(f => ({ ...f, photo_url: urlData.publicUrl }));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fetchAll = async () => {
    const [empRes, deptRes, desigRes] = await Promise.all([
      supabase.from("employees").select("*, departments(name), designations(name)").order("sort_order"),
      supabase.from("departments").select("id, name, sort_order").order("sort_order"),
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

  const handleMove = async (deptId: string | null, index: number, direction: "up" | "down") => {
    const membersInDept = items
      .filter(m => m.department_id === deptId)
      .sort((a, b) => a.sort_order - b.sort_order);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= membersInDept.length) return;
    const current = membersInDept[index];
    const target = membersInDept[targetIndex];
    await Promise.all([
      supabase.from("employees").update({ sort_order: target.sort_order }).eq("id", current.id),
      supabase.from("employees").update({ sort_order: current.sort_order }).eq("id", target.id),
    ]);
    fetchAll();
  };

  // Group employees by department
  const getGroupedEmployees = () => {
    const groups: { deptId: string | null; deptName: string; members: Employee[] }[] = [];
    
    // Add department groups in sort order
    for (const dept of depts) {
      const members = items
        .filter(e => e.department_id === dept.id)
        .sort((a, b) => a.sort_order - b.sort_order);
      if (members.length > 0) {
        groups.push({ deptId: dept.id, deptName: dept.name, members });
      }
    }
    
    // Add ungrouped employees
    const ungrouped = items
      .filter(e => !e.department_id)
      .sort((a, b) => a.sort_order - b.sort_order);
    if (ungrouped.length > 0) {
      groups.push({ deptId: null, deptName: "No Department", members: ungrouped });
    }
    
    return groups;
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const groups = getGroupedEmployees();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Employees</h2>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Employee</Button>
      </div>

      {groups.map((group) => (
        <Card key={group.deptId ?? "none"}>
          <CardContent className="p-0">
            <div className="px-4 py-3 border-b bg-muted/50">
              <h3 className="font-semibold text-sm">{group.deptName}</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>About Page</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.members.map((e, idx) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground text-xs">{e.sort_order}</TableCell>
                    <TableCell>
                      {e.photo_url ? (
                        <img src={e.photo_url} alt={e.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"><User className="h-5 w-5 text-muted-foreground" /></div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell>{e.designations?.name ?? "—"}</TableCell>
                    <TableCell>{e.phone ?? "—"}</TableCell>
                    <TableCell><Switch checked={e.show_on_about} onCheckedChange={() => toggleAbout(e)} /></TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="icon" variant="ghost" disabled={idx === 0} onClick={() => handleMove(group.deptId, idx, "up")}><ArrowUp className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" disabled={idx === group.members.length - 1} onClick={() => handleMove(group.deptId, idx, "down")}><ArrowDown className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

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
            <div>
              <Label>Photo</Label>
              {form.photo_url ? (
                <div className="relative w-32 h-32 mt-2">
                  <img src={form.photo_url} alt="Preview" className="w-full h-full object-cover rounded-lg border" />
                  <button type="button" onClick={() => setForm(f => ({ ...f, photo_url: "" }))} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> : <Upload className="h-8 w-8 text-muted-foreground" />}
                  <span className="text-sm text-muted-foreground mt-2">{uploading ? "Uploading..." : "Click to upload photo"}</span>
                  <span className="text-xs text-muted-foreground">Max 5MB</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Input className="mt-2" value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} placeholder="Or paste image URL..." />
            </div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} /></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Switch checked={form.visible} onCheckedChange={v => setForm(f => ({ ...f, visible: v }))} /><Label>Visible</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.show_on_about} onCheckedChange={v => setForm(f => ({ ...f, show_on_about: v }))} /><Label>Show on About</Label></div>
            </div>
            <Button onClick={handleSave} className="w-full" disabled={uploading}>{uploading ? "Uploading..." : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManager;
