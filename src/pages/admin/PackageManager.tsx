import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Pkg {
  id: string;
  name: string;
  name_bn: string | null;
  speed: number;
  price: number;
  category: "home" | "corporate";
  features: string[];
  badges: string[];
  featured: boolean;
  visible: boolean;
  sort_order: number;
}

const emptyPkg: Omit<Pkg, "id"> = {
  name: "", name_bn: "", speed: 0, price: 0, category: "home",
  features: [], badges: [], featured: false, visible: true, sort_order: 0,
};

const PackageManager = () => {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [form, setForm] = useState(emptyPkg);
  const [saving, setSaving] = useState(false);
  const [featuresStr, setFeaturesStr] = useState("");
  const [badgesStr, setBadgesStr] = useState("");
  const { toast } = useToast();

  const fetchPackages = async () => {
    const { data } = await supabase.from("packages").select("*").order("sort_order");
    setPackages((data ?? []) as Pkg[]);
    setLoading(false);
  };

  useEffect(() => { fetchPackages(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyPkg);
    setFeaturesStr("");
    setBadgesStr("");
    setDialogOpen(true);
  };

  const openEdit = (pkg: Pkg) => {
    setEditing(pkg);
    setForm({ ...pkg });
    setFeaturesStr((pkg.features ?? []).join(", "));
    setBadgesStr((pkg.badges ?? []).join(", "));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      features: featuresStr.split(",").map(s => s.trim()).filter(Boolean),
      badges: badgesStr.split(",").map(s => s.trim()).filter(Boolean),
    };

    if (editing) {
      const { error } = await supabase.from("packages").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Package updated" });
    } else {
      const { error } = await supabase.from("packages").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Package created" });
    }
    setSaving(false);
    setDialogOpen(false);
    fetchPackages();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("packages").delete().eq("id", deleteId);
    setDeleteId(null);
    toast({ title: "Package deleted" });
    fetchPackages();
  };

  const toggleField = async (id: string, field: "visible" | "featured", val: boolean) => {
    await supabase.from("packages").update({ [field]: val }).eq("id", id);
    fetchPackages();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Packages</h2>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Package</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Speed</TableHead>
            <TableHead>Price (৳)</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Visible</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map(pkg => (
            <TableRow key={pkg.id}>
              <TableCell className="font-medium">{pkg.name}</TableCell>
              <TableCell>{pkg.speed} Mbps</TableCell>
              <TableCell>৳{pkg.price}</TableCell>
              <TableCell><Badge variant="secondary">{pkg.category}</Badge></TableCell>
              <TableCell>
                <Switch checked={pkg.featured} onCheckedChange={(v) => toggleField(pkg.id, "featured", v)} />
              </TableCell>
              <TableCell>
                <Switch checked={pkg.visible} onCheckedChange={(v) => toggleField(pkg.id, "visible", v)} />
              </TableCell>
              <TableCell className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(pkg)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(pkg.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Package" : "Add Package"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name (EN)</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Name (BN)</Label>
                <Input value={form.name_bn ?? ""} onChange={e => setForm(f => ({ ...f, name_bn: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Speed (Mbps)</Label>
                <Input type="number" value={form.speed} onChange={e => setForm(f => ({ ...f, speed: +e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Price (৳)</Label>
                <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v: "home" | "corporate") => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Features (comma-separated)</Label>
              <Input value={featuresStr} onChange={e => setFeaturesStr(e.target.value)} placeholder="Unlimited Data, 24/7 Support" />
            </div>
            <div className="space-y-2">
              <Label>Badges (comma-separated)</Label>
              <Input value={badgesStr} onChange={e => setBadgesStr(e.target.value)} placeholder="BDIX, FTP, Gaming" />
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.featured} onCheckedChange={v => setForm(f => ({ ...f, featured: v }))} />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.visible} onCheckedChange={v => setForm(f => ({ ...f, visible: v }))} />
                <Label>Visible</Label>
              </div>
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package?</AlertDialogTitle>
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

export default PackageManager;
