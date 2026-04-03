import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FestivalRow {
  id: string;
  name: string;
  name_bn: string | null;
  greeting_en: string | null;
  greeting_bn: string | null;
  start_date: string;
  end_date: string;
  hero_image_url: string | null;
  gradient_from: string | null;
  gradient_to: string | null;
  accent_color: string | null;
  decoration_type: string;
  animation_type: string;
  is_ramadan: boolean;
  sehri_time: string | null;
  iftar_time: string | null;
  enabled: boolean;
  banner_text_en: string | null;
  banner_text_bn: string | null;
}

const emptyFestival: Omit<FestivalRow, "id"> = {
  name: "",
  name_bn: null,
  greeting_en: null,
  greeting_bn: null,
  start_date: "",
  end_date: "",
  hero_image_url: null,
  gradient_from: "#0c2340",
  gradient_to: "#0e7490",
  accent_color: null,
  decoration_type: "none",
  animation_type: "none",
  is_ramadan: false,
  sehri_time: null,
  iftar_time: null,
  enabled: true,
  banner_text_en: null,
  banner_text_bn: null,
};

const FestivalManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<FestivalRow | null>(null);
  const [form, setForm] = useState<Omit<FestivalRow, "id">>(emptyFestival);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: festivals = [], isLoading } = useQuery({
    queryKey: ["admin_festivals"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("festival_themes").select("*").order("start_date", { ascending: false });
      if (error) throw error;
      return (data || []) as FestivalRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        await (supabase as any).from("festival_themes").update(form).eq("id", editing.id);
      } else {
        await (supabase as any).from("festival_themes").insert(form);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_festivals"] });
      toast({ title: editing ? "Festival updated!" : "Festival created!" });
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyFestival);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("festival_themes" as any).delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_festivals"] });
      toast({ title: "Festival deleted" });
    },
  });

  const toggleEnabled = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      await supabase.from("festival_themes" as any).update({ enabled } as any).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_festivals"] }),
  });

  const openEdit = (f: FestivalRow) => {
    setEditing(f);
    const { id, ...rest } = f;
    setForm(rest);
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyFestival);
    setDialogOpen(true);
  };

  const set = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Festival Themes</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add Festival</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Festival" : "New Festival"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name (EN)</Label>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Eid ul-Fitr" className="mt-1" />
                </div>
                <div>
                  <Label>Name (BN)</Label>
                  <Input value={form.name_bn || ""} onChange={(e) => set("name_bn", e.target.value)} placeholder="ঈদ উল ফিতর" className="mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Greeting (EN)</Label>
                  <Input value={form.greeting_en || ""} onChange={(e) => set("greeting_en", e.target.value)} placeholder="Eid Mubarak!" className="mt-1" />
                </div>
                <div>
                  <Label>Greeting (BN)</Label>
                  <Input value={form.greeting_bn || ""} onChange={(e) => set("greeting_bn", e.target.value)} placeholder="ঈদ মুবারক!" className="mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className="mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Banner Text (EN)</Label>
                  <Input value={form.banner_text_en || ""} onChange={(e) => set("banner_text_en", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Banner Text (BN)</Label>
                  <Input value={form.banner_text_bn || ""} onChange={(e) => set("banner_text_bn", e.target.value)} className="mt-1" />
                </div>
              </div>

              <div>
                <Label>Hero Image URL</Label>
                <Input value={form.hero_image_url || ""} onChange={(e) => set("hero_image_url", e.target.value)} placeholder="https://..." className="mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gradient From</Label>
                  <div className="flex gap-2 mt-1">
                    <input type="color" value={form.gradient_from || "#0c2340"} onChange={(e) => set("gradient_from", e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
                    <Input value={form.gradient_from || ""} onChange={(e) => set("gradient_from", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Gradient To</Label>
                  <div className="flex gap-2 mt-1">
                    <input type="color" value={form.gradient_to || "#0e7490"} onChange={(e) => set("gradient_to", e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
                    <Input value={form.gradient_to || ""} onChange={(e) => set("gradient_to", e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <Label>Accent Color (CSS)</Label>
                <Input value={form.accent_color || ""} onChange={(e) => set("accent_color", e.target.value)} placeholder="45 100% 50%" className="mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Decoration Type</Label>
                  <Select value={form.decoration_type} onValueChange={(v) => set("decoration_type", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["none", "lanterns", "stars", "lights", "confetti", "alpana"].map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Animation Type</Label>
                  <Select value={form.animation_type} onValueChange={(v) => set("animation_type", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["none", "particles", "glow", "snowfall"].map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Switch checked={form.is_ramadan} onCheckedChange={(v) => set("is_ramadan", v)} />
                <Label>Ramadan Mode</Label>
              </div>

              {form.is_ramadan && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Sehri Time</Label>
                    <Input value={form.sehri_time || ""} onChange={(e) => set("sehri_time", e.target.value)} placeholder="04:15 AM" className="mt-1" />
                  </div>
                  <div>
                    <Label>Iftar Time</Label>
                    <Input value={form.iftar_time || ""} onChange={(e) => set("iftar_time", e.target.value)} placeholder="06:30 PM" className="mt-1" />
                  </div>
                </div>
              )}

              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name || !form.start_date || !form.end_date} className="w-full">
                <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? "Saving..." : "Save Festival"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading...</p>}

      <div className="grid gap-4">
        {festivals.map((f) => {
          const isActive = f.enabled && f.start_date <= today && f.end_date >= today;
          return (
            <Card key={f.id} className={isActive ? "border-accent ring-1 ring-accent/20" : ""}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Sparkles className={`h-5 w-5 shrink-0 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{f.name} {f.name_bn && `(${f.name_bn})`}</p>
                    <p className="text-xs text-muted-foreground">{f.start_date} → {f.end_date} {isActive && <span className="text-accent font-medium ml-1">● Active</span>}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.decoration_type !== "none" && `🎨 ${f.decoration_type}`}
                      {f.is_ramadan && " 🌙 Ramadan"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={f.enabled} onCheckedChange={(v) => toggleEnabled.mutate({ id: f.id, enabled: v })} />
                  <Button variant="outline" size="sm" onClick={() => openEdit(f)}>Edit</Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(f.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FestivalManager;
