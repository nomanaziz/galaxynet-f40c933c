import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Pencil, Trash2, Loader2, ChevronRight, ChevronDown, MapPin, CheckSquare, XSquare, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Location {
  id: string;
  name: string;
  name_bn: string | null;
  type: "district" | "thana" | "zone";
  parent_id: string | null;
  sort_order: number;
}

interface Area {
  id: string;
  name: string;
  name_bn: string | null;
  zone: string | null;
  district: string | null;
  available: boolean;
  location_id: string | null;
}

// ─── LOCATIONS TAB ───

const LocationsTab = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState({ name: "", name_bn: "", type: "district" as Location["type"], parent_id: null as string | null });
  const [saving, setSaving] = useState(false);
  const [openDistricts, setOpenDistricts] = useState<Set<string>>(new Set());
  const [openThanas, setOpenThanas] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("coverage_locations").select("*").order("sort_order");
    setLocations((data ?? []) as Location[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const districts = useMemo(() => locations.filter(l => l.type === "district"), [locations]);
  const thanasOf = (distId: string) => locations.filter(l => l.type === "thana" && l.parent_id === distId);
  const zonesOf = (thanaId: string) => locations.filter(l => l.type === "zone" && l.parent_id === thanaId);

  const openAdd = (type: Location["type"], parentId: string | null) => {
    setEditing(null);
    setForm({ name: "", name_bn: "", type, parent_id: parentId });
    setDialogOpen(true);
  };

  const openEdit = (loc: Location) => {
    setEditing(loc);
    setForm({ name: loc.name, name_bn: loc.name_bn ?? "", type: loc.type, parent_id: loc.parent_id });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { name: form.name, name_bn: form.name_bn || null, type: form.type, parent_id: form.parent_id };
    if (editing) {
      const { error } = await supabase.from("coverage_locations").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Location updated" });
    } else {
      const { error } = await supabase.from("coverage_locations").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Location created" });
    }
    setSaving(false);
    setDialogOpen(false);
    fetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("coverage_locations").delete().eq("id", deleteId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Location deleted" });
    setDeleteId(null);
    fetch();
  };

  const toggleDistrict = (id: string) => setOpenDistricts(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleThana = (id: string) => setOpenThanas(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = { district: "bg-primary/10 text-primary", thana: "bg-accent/10 text-accent", zone: "bg-muted text-muted-foreground" };
    return <Badge className={colors[type] ?? ""}>{type}</Badge>;
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Manage Districts → Thanas → Zones hierarchy</p>
        <Button onClick={() => openAdd("district", null)} size="sm"><Plus className="mr-1 h-4 w-4" />Add District</Button>
      </div>

      {districts.length === 0 && <p className="text-center text-muted-foreground py-8">No locations yet. Add a district to get started.</p>}

      <div className="space-y-2">
        {districts.map(dist => (
          <Collapsible key={dist.id} open={openDistricts.has(dist.id)} onOpenChange={() => toggleDistrict(dist.id)}>
            <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  {openDistricts.has(dist.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium flex-1">{dist.name}</span>
              {dist.name_bn && <span className="text-sm text-muted-foreground">{dist.name_bn}</span>}
              {typeBadge(dist.type)}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(dist)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(dist.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => openAdd("thana", dist.id)}><Plus className="h-3 w-3 mr-1" />Thana</Button>
            </div>
            <CollapsibleContent className="ml-8 mt-1 space-y-1">
              {thanasOf(dist.id).map(thana => (
                <Collapsible key={thana.id} open={openThanas.has(thana.id)} onOpenChange={() => toggleThana(thana.id)}>
                  <div className="flex items-center gap-2 p-2.5 bg-secondary/50 border rounded-md">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        {openThanas.has(thana.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </Button>
                    </CollapsibleTrigger>
                    <span className="font-medium text-sm flex-1">{thana.name}</span>
                    {thana.name_bn && <span className="text-xs text-muted-foreground">{thana.name_bn}</span>}
                    {typeBadge(thana.type)}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(thana)}><Pencil className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDeleteId(thana.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                    <Button variant="outline" size="sm" className="text-xs h-6" onClick={() => openAdd("zone", thana.id)}><Plus className="h-3 w-3 mr-1" />Zone</Button>
                  </div>
                  <CollapsibleContent className="ml-8 mt-1 space-y-1">
                    {zonesOf(thana.id).map(zone => (
                      <div key={zone.id} className="flex items-center gap-2 p-2 bg-background border rounded-sm">
                        <span className="text-sm flex-1">{zone.name}</span>
                        {zone.name_bn && <span className="text-xs text-muted-foreground">{zone.name_bn}</span>}
                        {typeBadge(zone.type)}
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => openEdit(zone)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setDeleteId(zone.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Add"} {form.type.charAt(0).toUpperCase() + form.type.slice(1)}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name (EN)</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Name (BN)</Label><Input value={form.name_bn} onChange={e => setForm(f => ({ ...f, name_bn: e.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location?</AlertDialogTitle>
            <AlertDialogDescription>This will also delete all child locations underneath. This action cannot be undone.</AlertDialogDescription>
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

// ─── AREAS TAB ───

const AreasTab = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Area | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ name: "", name_bn: "", available: true, location_id: null as string | null });
  const [saving, setSaving] = useState(false);

  // Cascading dropdown state
  const [selDistrict, setSelDistrict] = useState<string>("");
  const [selThana, setSelThana] = useState<string>("");
  const [selZone, setSelZone] = useState<string>("");

  const { toast } = useToast();

  const fetchAll = async () => {
    const [areasRes, locsRes] = await Promise.all([
      supabase.from("coverage_areas").select("*").order("name"),
      supabase.from("coverage_locations").select("*").order("sort_order"),
    ]);
    setAreas((areasRes.data ?? []) as Area[]);
    setLocations((locsRes.data ?? []) as Location[]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const districts = useMemo(() => locations.filter(l => l.type === "district"), [locations]);
  const thanas = useMemo(() => locations.filter(l => l.type === "thana"), [locations]);
  const zones = useMemo(() => locations.filter(l => l.type === "zone"), [locations]);

  const thanasForDistrict = selDistrict ? thanas.filter(t => t.parent_id === selDistrict) : [];
  const zonesForThana = selThana ? zones.filter(z => z.parent_id === selThana) : [];

  const locationMap = useMemo(() => {
    const m = new Map<string, Location>();
    locations.forEach(l => m.set(l.id, l));
    return m;
  }, [locations]);

  const getBreadcrumb = (locationId: string | null): string => {
    if (!locationId) return "—";
    const parts: string[] = [];
    let current = locationMap.get(locationId);
    while (current) {
      parts.unshift(current.name);
      current = current.parent_id ? locationMap.get(current.parent_id) : undefined;
    }
    return parts.join(" > ");
  };

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", name_bn: "", available: true, location_id: null });
    setSelDistrict(""); setSelThana(""); setSelZone("");
    setDialogOpen(true);
  };

  const openEdit = (a: Area) => {
    setEditing(a);
    setForm({ name: a.name, name_bn: a.name_bn ?? "", available: a.available, location_id: a.location_id });
    // Resolve cascading selections
    if (a.location_id) {
      const zone = locationMap.get(a.location_id);
      if (zone) {
        setSelZone(zone.id);
        const thana = zone.parent_id ? locationMap.get(zone.parent_id) : undefined;
        if (thana) {
          setSelThana(thana.id);
          setSelDistrict(thana.parent_id ?? "");
        }
      }
    } else {
      setSelDistrict(""); setSelThana(""); setSelZone("");
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { name: form.name, name_bn: form.name_bn || null, available: form.available, location_id: selZone || null };
    if (editing) {
      const { error } = await supabase.from("coverage_areas").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Area updated" });
    } else {
      const { error } = await supabase.from("coverage_areas").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Area created" });
    }
    setSaving(false);
    setDialogOpen(false);
    fetchAll();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("coverage_areas").delete().eq("id", deleteId);
    setDeleteId(null);
    toast({ title: "Area deleted" });
    fetchAll();
  };

  // Bulk actions
  const toggleSelect = (id: string) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => setSelected(prev => prev.size === areas.length ? new Set() : new Set(areas.map(a => a.id)));

  const bulkSetAvailable = async (val: boolean) => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    await Promise.all(ids.map(id => supabase.from("coverage_areas").update({ available: val }).eq("id", id)));
    toast({ title: `${ids.length} areas marked ${val ? "available" : "unavailable"}` });
    setSelected(new Set());
    fetchAll();
  };

  const bulkDelete = async () => {
    const ids = Array.from(selected);
    await Promise.all(ids.map(id => supabase.from("coverage_areas").delete().eq("id", id)));
    toast({ title: `${ids.length} areas deleted` });
    setSelected(new Set());
    setBulkDeleteOpen(false);
    fetchAll();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{areas.length} coverage areas</p>
        <Button onClick={openNew} size="sm"><Plus className="mr-1 h-4 w-4" />Add Area</Button>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Button variant="outline" size="sm" onClick={() => bulkSetAvailable(true)}><CheckSquare className="h-3.5 w-3.5 mr-1" />Mark Available</Button>
          <Button variant="outline" size="sm" onClick={() => bulkSetAvailable(false)}><XSquare className="h-3.5 w-3.5 mr-1" />Mark Unavailable</Button>
          <Button variant="destructive" size="sm" onClick={() => setBulkDeleteOpen(true)}><Trash className="h-3.5 w-3.5 mr-1" />Delete Selected</Button>
          <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Deselect All</Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox checked={selected.size === areas.length && areas.length > 0} onCheckedChange={toggleAll} />
            </TableHead>
            <TableHead>Name (EN)</TableHead>
            <TableHead>Name (BN)</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas.map(area => (
            <TableRow key={area.id}>
              <TableCell><Checkbox checked={selected.has(area.id)} onCheckedChange={() => toggleSelect(area.id)} /></TableCell>
              <TableCell className="font-medium">{area.name}</TableCell>
              <TableCell>{area.name_bn}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{getBreadcrumb(area.location_id)}</TableCell>
              <TableCell>
                <Switch checked={area.available} onCheckedChange={async (v) => { await supabase.from("coverage_areas").update({ available: v }).eq("id", area.id); fetchAll(); }} />
              </TableCell>
              <TableCell className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(area)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(area.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Area" : "Add Area"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name (EN)</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Name (BN)</Label><Input value={form.name_bn} onChange={e => setForm(f => ({ ...f, name_bn: e.target.value }))} /></div>
            </div>
            {/* Cascading dropdowns */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>District</Label>
                <Select value={selDistrict} onValueChange={(v) => { setSelDistrict(v); setSelThana(""); setSelZone(""); }}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Thana</Label>
                <Select value={selThana} onValueChange={(v) => { setSelThana(v); setSelZone(""); }} disabled={!selDistrict}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {thanasForDistrict.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Zone</Label>
                <Select value={selZone} onValueChange={setSelZone} disabled={!selThana}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {zonesForThana.map(z => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.available} onCheckedChange={v => setForm(f => ({ ...f, available: v }))} />
              <Label>Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single delete */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Area?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete {selected.size} Areas?</AlertDialogTitle><AlertDialogDescription>This will permanently delete all selected areas.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={bulkDelete}>Delete All</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ─── MAIN COMPONENT ───

const CoverageManager = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Coverage Management</h2>
      <Tabs defaultValue="locations">
        <TabsList>
          <TabsTrigger value="locations">Locations (Hierarchy)</TabsTrigger>
          <TabsTrigger value="areas">Coverage Areas</TabsTrigger>
        </TabsList>
        <TabsContent value="locations"><LocationsTab /></TabsContent>
        <TabsContent value="areas"><AreasTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default CoverageManager;
