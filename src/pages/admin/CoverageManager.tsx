import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Area {
  id: string;
  name: string;
  name_bn: string | null;
  zone: string | null;
  district: string | null;
  available: boolean;
}

const emptyArea = { name: "", name_bn: "", zone: "", district: "", available: true };

const CoverageManager = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Area | null>(null);
  const [form, setForm] = useState(emptyArea);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchAreas = async () => {
    const { data } = await supabase.from("coverage_areas").select("*").order("name");
    setAreas((data ?? []) as Area[]);
    setLoading(false);
  };

  useEffect(() => { fetchAreas(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyArea); setDialogOpen(true); };
  const openEdit = (a: Area) => { setEditing(a); setForm({ name: a.name, name_bn: a.name_bn ?? "", zone: a.zone ?? "", district: a.district ?? "", available: a.available }); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("coverage_areas").update(form).eq("id", editing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Area updated" });
    } else {
      const { error } = await supabase.from("coverage_areas").insert(form);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Area created" });
    }
    setSaving(false);
    setDialogOpen(false);
    fetchAreas();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("coverage_areas").delete().eq("id", deleteId);
    setDeleteId(null);
    toast({ title: "Area deleted" });
    fetchAreas();
  };

  const toggleAvailable = async (id: string, val: boolean) => {
    await supabase.from("coverage_areas").update({ available: val }).eq("id", id);
    fetchAreas();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Coverage Areas</h2>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Area</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name (EN)</TableHead>
            <TableHead>Name (BN)</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>District</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas.map(area => (
            <TableRow key={area.id}>
              <TableCell className="font-medium">{area.name}</TableCell>
              <TableCell>{area.name_bn}</TableCell>
              <TableCell>{area.zone}</TableCell>
              <TableCell>{area.district}</TableCell>
              <TableCell>
                <Switch checked={area.available} onCheckedChange={(v) => toggleAvailable(area.id, v)} />
              </TableCell>
              <TableCell className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(area)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(area.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Area" : "Add Area"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name (EN)</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Name (BN)</Label>
                <Input value={form.name_bn} onChange={e => setForm(f => ({ ...f, name_bn: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Zone</Label>
                <Input value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.available} onCheckedChange={v => setForm(f => ({ ...f, available: v }))} />
              <Label>Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Area?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CoverageManager;
