import { useEffect, useState, useMemo, useCallback } from "react";
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
import { Plus, Pencil, Trash2, Loader2, ChevronRight, ChevronDown, MapPin, CheckSquare, XSquare, Trash, Upload, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  CoverageLocation,
  CoverageArea,
  buildLocationMap,
  buildDisabledLocationIds,
  getLocationBreadcrumb,
  getDisabledAncestorType,
} from "@/lib/coverageHierarchy";

// ─── LOCATIONS TAB ───

interface LocationsTabProps {
  locations: CoverageLocation[];
  loading: boolean;
  onRefresh: () => void;
}

const LocationsTab = ({ locations, loading, onRefresh }: LocationsTabProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<CoverageLocation | null>(null);
  const [form, setForm] = useState({ name: "", name_bn: "", type: "division" as CoverageLocation["type"], parent_id: null as string | null });
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [openDivisions, setOpenDivisions] = useState<Set<string>>(new Set());
  const [openDistricts, setOpenDistricts] = useState<Set<string>>(new Set());
  const [openThanas, setOpenThanas] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const divisions = useMemo(() => locations.filter(l => l.type === "division"), [locations]);
  const districtsOf = (divId: string) => locations.filter(l => l.type === "district" && l.parent_id === divId);
  const thanasOf = (distId: string) => locations.filter(l => l.type === "thana" && l.parent_id === distId);
  const zonesOf = (thanaId: string) => locations.filter(l => l.type === "zone" && l.parent_id === thanaId);

  const openAdd = (type: CoverageLocation["type"], parentId: string | null) => {
    setEditing(null);
    setForm({ name: "", name_bn: "", type, parent_id: parentId });
    setDialogOpen(true);
  };

  const openEdit = (loc: CoverageLocation) => {
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
    onRefresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("coverage_locations").delete().eq("id", deleteId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Location deleted" });
    setDeleteId(null);
    onRefresh();
  };

  const toggleEnabled = async (loc: CoverageLocation) => {
    const { error } = await supabase.from("coverage_locations").update({ enabled: !loc.enabled }).eq("id", loc.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    onRefresh();
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const { data, error } = await supabase.functions.invoke("seed-bangladesh-locations");
      if (error) throw error;
      toast({ title: "Data seeded successfully", description: `${data.divisions} divisions, ${data.districts} districts, ${data.thanas} thanas` });
      onRefresh();
    } catch (e: any) {
      toast({ title: "Seed failed", description: e.message, variant: "destructive" });
    }
    setSeeding(false);
  };

  const toggleDiv = (id: string) => setOpenDivisions(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleDist = (id: string) => setOpenDistricts(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleThana = (id: string) => setOpenThanas(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = { division: "bg-blue-100 text-blue-700", district: "bg-primary/10 text-primary", thana: "bg-accent/10 text-accent", zone: "bg-muted text-muted-foreground" };
    return <Badge className={colors[type] ?? ""}>{type}</Badge>;
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">Manage Divisions → Districts → Thanas → Zones hierarchy</p>
        <div className="flex gap-2">
          <Button onClick={handleSeedData} size="sm" variant="outline" disabled={seeding}>
            {seeding ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Upload className="mr-1 h-4 w-4" />}
            Seed Bangladesh Data
          </Button>
          <Button onClick={() => openAdd("division", null)} size="sm"><Plus className="mr-1 h-4 w-4" />Add Division</Button>
        </div>
      </div>

      {divisions.length === 0 && <p className="text-center text-muted-foreground py-8">No locations yet. Click "Seed Bangladesh Data" to load all divisions, districts & thanas.</p>}

      <div className="space-y-2">
        {divisions.map(div => (
          <Collapsible key={div.id} open={openDivisions.has(div.id)} onOpenChange={() => toggleDiv(div.id)}>
            <div className={`flex items-center gap-2 p-3 bg-card border rounded-lg ${!div.enabled ? "opacity-50" : ""}`}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  {openDivisions.has(div.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className={`font-semibold flex-1 ${!div.enabled ? "line-through" : ""}`}>{div.name}</span>
              {div.name_bn && <span className="text-sm text-muted-foreground">{div.name_bn}</span>}
              {typeBadge(div.type)}
              <Switch checked={div.enabled} onCheckedChange={() => toggleEnabled(div)} />
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(div)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(div.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => openAdd("district", div.id)}><Plus className="h-3 w-3 mr-1" />District</Button>
            </div>
            <CollapsibleContent className="ml-6 mt-1 space-y-1">
              {districtsOf(div.id).map(dist => (
                <Collapsible key={dist.id} open={openDistricts.has(dist.id)} onOpenChange={() => toggleDist(dist.id)}>
                  <div className={`flex items-center gap-2 p-3 bg-card border rounded-lg ${!dist.enabled ? "opacity-50" : ""}`}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        {openDistricts.has(dist.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className={`font-medium flex-1 ${!dist.enabled ? "line-through" : ""}`}>{dist.name}</span>
                    {dist.name_bn && <span className="text-sm text-muted-foreground">{dist.name_bn}</span>}
                    {typeBadge(dist.type)}
                    <Switch checked={dist.enabled} onCheckedChange={() => toggleEnabled(dist)} />
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(dist)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(dist.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => openAdd("thana", dist.id)}><Plus className="h-3 w-3 mr-1" />Thana</Button>
                  </div>
                  <CollapsibleContent className="ml-8 mt-1 space-y-1">
                    {thanasOf(dist.id).map(thana => (
                      <Collapsible key={thana.id} open={openThanas.has(thana.id)} onOpenChange={() => toggleThana(thana.id)}>
                        <div className={`flex items-center gap-2 p-2.5 bg-secondary/50 border rounded-md ${!thana.enabled ? "opacity-50" : ""}`}>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5">
                              {openThanas.has(thana.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                            </Button>
                          </CollapsibleTrigger>
                          <span className={`font-medium text-sm flex-1 ${!thana.enabled ? "line-through" : ""}`}>{thana.name}</span>
                          {thana.name_bn && <span className="text-xs text-muted-foreground">{thana.name_bn}</span>}
                          {typeBadge(thana.type)}
                          <Switch checked={thana.enabled} onCheckedChange={() => toggleEnabled(thana)} />
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(thana)}><Pencil className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDeleteId(thana.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                          <Button variant="outline" size="sm" className="text-xs h-6" onClick={() => openAdd("zone", thana.id)}><Plus className="h-3 w-3 mr-1" />Zone</Button>
                        </div>
                        <CollapsibleContent className="ml-8 mt-1 space-y-1">
                          {zonesOf(thana.id).map(zone => (
                            <div key={zone.id} className={`flex items-center gap-2 p-2 bg-background border rounded-sm ${!zone.enabled ? "opacity-50" : ""}`}>
                              <span className={`text-sm flex-1 ${!zone.enabled ? "line-through" : ""}`}>{zone.name}</span>
                              {zone.name_bn && <span className="text-xs text-muted-foreground">{zone.name_bn}</span>}
                              {typeBadge(zone.type)}
                              <Switch checked={zone.enabled} onCheckedChange={() => toggleEnabled(zone)} />
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
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

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

interface AreasTabProps {
  areas: CoverageArea[];
  locations: CoverageLocation[];
  loading: boolean;
  onRefresh: () => void;
}

const AreasTab = ({ areas, locations, loading, onRefresh }: AreasTabProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<CoverageArea | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ name: "", name_bn: "", available: true, location_id: null as string | null });
  const [saving, setSaving] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [search, setSearch] = useState("");

  // Cascading filter state
  const [filterDivision, setFilterDivision] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterThana, setFilterThana] = useState("");
  const [filterZone, setFilterZone] = useState("");

  // Dialog cascading dropdown state
  const [selDivision, setSelDivision] = useState("");
  const [selDistrict, setSelDistrict] = useState("");
  const [selThana, setSelThana] = useState("");
  const [selZone, setSelZone] = useState("");

  const { toast } = useToast();

  const locationMap = useMemo(() => buildLocationMap(locations), [locations]);
  const disabledLocationIds = useMemo(() => buildDisabledLocationIds(locations, locationMap), [locations, locationMap]);

  // Enabled-only locations for dialog dropdowns
  const enabledLocations = useMemo(() => locations.filter(l => !disabledLocationIds.has(l.id)), [locations, disabledLocationIds]);

  const divisionsList = useMemo(() => locations.filter(l => l.type === "division"), [locations]);
  const enabledDivisions = useMemo(() => enabledLocations.filter(l => l.type === "division"), [enabledLocations]);

  // Filter dropdowns (show all for filtering)
  const filterDistricts = useMemo(() => filterDivision ? locations.filter(l => l.type === "district" && l.parent_id === filterDivision) : [], [locations, filterDivision]);
  const filterThanas = useMemo(() => filterDistrict ? locations.filter(l => l.type === "thana" && l.parent_id === filterDistrict) : [], [locations, filterDistrict]);
  const filterZones = useMemo(() => filterThana ? locations.filter(l => l.type === "zone" && l.parent_id === filterThana) : [], [locations, filterThana]);

  // Dialog dropdowns (enabled only)
  const dialogDistricts = useMemo(() => selDivision ? enabledLocations.filter(l => l.type === "district" && l.parent_id === selDivision) : [], [enabledLocations, selDivision]);
  const dialogThanas = useMemo(() => selDistrict ? enabledLocations.filter(l => l.type === "thana" && l.parent_id === selDistrict) : [], [enabledLocations, selDistrict]);
  const dialogZones = useMemo(() => selThana ? enabledLocations.filter(l => l.type === "zone" && l.parent_id === selThana) : [], [enabledLocations, selThana]);

  // Compute effective areas
  const computedAreas = useMemo(() => {
    return areas.map(area => {
      const isHierarchyDisabled = area.location_id ? disabledLocationIds.has(area.location_id) : false;
      const disabledBy = area.location_id && isHierarchyDisabled ? getDisabledAncestorType(area.location_id, locationMap) : null;
      return { ...area, isHierarchyDisabled, disabledBy };
    });
  }, [areas, disabledLocationIds, locationMap]);

  // Filter areas
  const filteredAreas = useMemo(() => {
    return computedAreas.filter(area => {
      // Hide hierarchy-disabled unless showHidden
      if (area.isHierarchyDisabled && !showHidden) return false;

      // Search
      if (search) {
        const q = search.toLowerCase();
        if (!area.name.toLowerCase().includes(q) && !(area.name_bn || "").includes(search)) return false;
      }

      // Cascading location filter
      if (filterZone) {
        return area.location_id === filterZone;
      } else if (filterThana) {
        const zoneIds = locations.filter(l => l.type === "zone" && l.parent_id === filterThana).map(l => l.id);
        return area.location_id === filterThana || zoneIds.includes(area.location_id ?? "");
      } else if (filterDistrict) {
        const thanaIds = locations.filter(l => l.type === "thana" && l.parent_id === filterDistrict).map(l => l.id);
        const zoneIds = locations.filter(l => l.type === "zone" && thanaIds.includes(l.parent_id!)).map(l => l.id);
        return thanaIds.includes(area.location_id ?? "") || zoneIds.includes(area.location_id ?? "");
      } else if (filterDivision) {
        const distIds = locations.filter(l => l.type === "district" && l.parent_id === filterDivision).map(l => l.id);
        const thanaIds = locations.filter(l => l.type === "thana" && distIds.includes(l.parent_id!)).map(l => l.id);
        const zoneIds = locations.filter(l => l.type === "zone" && thanaIds.includes(l.parent_id!)).map(l => l.id);
        return distIds.includes(area.location_id ?? "") || thanaIds.includes(area.location_id ?? "") || zoneIds.includes(area.location_id ?? "");
      }

      return true;
    });
  }, [computedAreas, showHidden, search, filterDivision, filterDistrict, filterThana, filterZone, locations]);

  const visibleCount = computedAreas.filter(a => !a.isHierarchyDisabled).length;
  const hiddenCount = computedAreas.filter(a => a.isHierarchyDisabled).length;

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", name_bn: "", available: true, location_id: null });
    setSelDivision(""); setSelDistrict(""); setSelThana(""); setSelZone("");
    setDialogOpen(true);
  };

  const openEdit = (a: CoverageArea) => {
    setEditing(a);
    setForm({ name: a.name, name_bn: a.name_bn ?? "", available: a.available, location_id: a.location_id });
    if (a.location_id) {
      let loc = locationMap.get(a.location_id);
      if (loc?.type === "zone") {
        setSelZone(loc.id);
        const thana = loc.parent_id ? locationMap.get(loc.parent_id) : undefined;
        if (thana) {
          setSelThana(thana.id);
          const dist = thana.parent_id ? locationMap.get(thana.parent_id) : undefined;
          if (dist) {
            setSelDistrict(dist.id);
            setSelDivision(dist.parent_id ?? "");
          }
        }
      } else if (loc?.type === "thana") {
        setSelZone("");
        setSelThana(loc.id);
        const dist = loc.parent_id ? locationMap.get(loc.parent_id) : undefined;
        if (dist) {
          setSelDistrict(dist.id);
          setSelDivision(dist.parent_id ?? "");
        }
      }
    } else {
      setSelDivision(""); setSelDistrict(""); setSelThana(""); setSelZone("");
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const locationId = selZone || selThana || null;
    const payload = { name: form.name, name_bn: form.name_bn || null, available: form.available, location_id: locationId };
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
    onRefresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("coverage_areas").delete().eq("id", deleteId);
    setDeleteId(null);
    toast({ title: "Area deleted" });
    onRefresh();
  };

  const toggleSelect = (id: string) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const selectableAreas = filteredAreas.filter(a => !a.isHierarchyDisabled);
  const toggleAll = () => setSelected(prev => prev.size === selectableAreas.length ? new Set() : new Set(selectableAreas.map(a => a.id)));

  const bulkSetAvailable = async (val: boolean) => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    await Promise.all(ids.map(id => supabase.from("coverage_areas").update({ available: val }).eq("id", id)));
    toast({ title: `${ids.length} areas marked ${val ? "available" : "unavailable"}` });
    setSelected(new Set());
    onRefresh();
  };

  const bulkDelete = async () => {
    const ids = Array.from(selected);
    await Promise.all(ids.map(id => supabase.from("coverage_areas").delete().eq("id", id)));
    toast({ title: `${ids.length} areas deleted` });
    setSelected(new Set());
    setBulkDeleteOpen(false);
    onRefresh();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Total: <strong>{areas.length}</strong></span>
          <span className="text-green-600">Visible: <strong>{visibleCount}</strong></span>
          {hiddenCount > 0 && (
            <span className="text-orange-600">Hidden by hierarchy: <strong>{hiddenCount}</strong></span>
          )}
        </div>
        <Button onClick={openNew} size="sm"><Plus className="mr-1 h-4 w-4" />Add Area</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
        <div className="w-full sm:w-auto">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Division</label>
          <Select value={filterDivision} onValueChange={(v) => { setFilterDivision(v === "all" ? "" : v); setFilterDistrict(""); setFilterThana(""); setFilterZone(""); }}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Divisions" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              {divisionsList.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">District</label>
          <Select value={filterDistrict} onValueChange={(v) => { setFilterDistrict(v === "all" ? "" : v); setFilterThana(""); setFilterZone(""); }} disabled={!filterDivision}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Districts" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {filterDistricts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Thana</label>
          <Select value={filterThana} onValueChange={(v) => { setFilterThana(v === "all" ? "" : v); setFilterZone(""); }} disabled={!filterDistrict}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Thanas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Thanas</SelectItem>
              {filterThanas.map(t2 => <SelectItem key={t2.id} value={t2.id}>{t2.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Zone</label>
          <Select value={filterZone} onValueChange={(v) => setFilterZone(v === "all" ? "" : v)} disabled={!filterThana}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Zones" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {filterZones.map(z => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Search</label>
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={showHidden} onCheckedChange={setShowHidden} />
          <label className="text-xs text-muted-foreground whitespace-nowrap">
            {showHidden ? <Eye className="h-3.5 w-3.5 inline mr-1" /> : <EyeOff className="h-3.5 w-3.5 inline mr-1" />}
            Show hidden
          </label>
        </div>
      </div>

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
              <Checkbox checked={selectableAreas.length > 0 && selected.size === selectableAreas.length} onCheckedChange={toggleAll} />
            </TableHead>
            <TableHead>Name (EN)</TableHead>
            <TableHead>Name (BN)</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAreas.map(area => (
            <TableRow key={area.id} className={area.isHierarchyDisabled ? "opacity-50 bg-muted/30" : ""}>
              <TableCell>
                <Checkbox
                  checked={selected.has(area.id)}
                  onCheckedChange={() => toggleSelect(area.id)}
                  disabled={area.isHierarchyDisabled}
                />
              </TableCell>
              <TableCell className="font-medium">{area.name}</TableCell>
              <TableCell>{area.name_bn}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{getLocationBreadcrumb(area.location_id, locationMap)}</TableCell>
              <TableCell>
                {area.isHierarchyDisabled ? (
                  <Badge variant="outline" className="text-orange-600 border-orange-300 text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Hidden by {area.disabledBy}
                  </Badge>
                ) : (
                  <Switch
                    checked={area.available}
                    onCheckedChange={async (v) => {
                      await supabase.from("coverage_areas").update({ available: v }).eq("id", area.id);
                      onRefresh();
                    }}
                  />
                )}
              </TableCell>
              <TableCell className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(area)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(area.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredAreas.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                {areas.length === 0 ? "No coverage areas yet." : "No areas match the current filters."}
              </TableCell>
            </TableRow>
          )}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label>Division</Label>
                <Select value={selDivision} onValueChange={(v) => { setSelDivision(v); setSelDistrict(""); setSelThana(""); setSelZone(""); }}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {enabledDivisions.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Select value={selDistrict} onValueChange={(v) => { setSelDistrict(v); setSelThana(""); setSelZone(""); }} disabled={!selDivision}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {dialogDistricts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Thana</Label>
                <Select value={selThana} onValueChange={(v) => { setSelThana(v); setSelZone(""); }} disabled={!selDistrict}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {dialogThanas.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Zone</Label>
                <Select value={selZone} onValueChange={setSelZone} disabled={!selThana}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {dialogZones.map(z => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {editing && editing.location_id && disabledLocationIds.has(editing.location_id) && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                This area is currently hidden because its parent location is disabled in the hierarchy.
              </div>
            )}
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Area?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
  const [areas, setAreas] = useState<CoverageArea[]>([]);
  const [locations, setLocations] = useState<CoverageLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [areasRes, locsRes] = await Promise.all([
      supabase.from("coverage_areas").select("*").order("name"),
      supabase.from("coverage_locations").select("*").order("sort_order"),
    ]);
    setAreas((areasRes.data ?? []) as CoverageArea[]);
    setLocations((locsRes.data ?? []) as CoverageLocation[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Coverage Management</h2>
      <Tabs defaultValue="locations">
        <TabsList>
          <TabsTrigger value="locations">Locations (Hierarchy)</TabsTrigger>
          <TabsTrigger value="areas">Coverage Areas</TabsTrigger>
        </TabsList>
        <TabsContent value="locations">
          <LocationsTab locations={locations} loading={loading} onRefresh={fetchAll} />
        </TabsContent>
        <TabsContent value="areas">
          <AreasTab areas={areas} locations={locations} loading={loading} onRefresh={fetchAll} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoverageManager;
