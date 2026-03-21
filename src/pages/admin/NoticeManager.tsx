import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const emptyNotice = { title: "", title_bn: "", category: "maintenance" as const, content: "", published: false };

const NoticeManager = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyNotice);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => { const { data } = await supabase.from("notices").select("*").order("created_at", { ascending: false }); setNotices(data ?? []); setLoading(false); };
  useEffect(() => { fetchData(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyNotice); setDialogOpen(true); };
  const openEdit = (n: any) => { setEditing(n); setForm({ title: n.title, title_bn: n.title_bn ?? "", category: n.category, content: n.content ?? "", published: n.published }); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("notices").update(form).eq("id", editing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else toast({ title: "Notice updated" });
    } else {
      const { error } = await supabase.from("notices").insert(form);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else toast({ title: "Notice created" });
    }
    setSaving(false); setDialogOpen(false); fetchData();
  };

  const handleDelete = async () => { if (!deleteId) return; await supabase.from("notices").delete().eq("id", deleteId); setDeleteId(null); toast({ title: "Notice deleted" }); fetchData(); };

  const catColor = (c: string) => c === "maintenance" ? "bg-orange-100 text-orange-800" : c === "offer" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notices</h2>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Notice</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {notices.map(n => (
            <TableRow key={n.id}>
              <TableCell className="font-medium">{n.title}</TableCell>
              <TableCell><Badge variant="secondary" className={catColor(n.category)}>{n.category}</Badge></TableCell>
              <TableCell><Badge variant={n.published ? "default" : "secondary"}>{n.published ? "Published" : "Draft"}</Badge></TableCell>
              <TableCell className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(n)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Notice" : "Add Notice"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Title (EN)</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Title (BN)</Label><Input value={form.title_bn} onChange={e => setForm(f => ({ ...f, title_bn: e.target.value }))} /></div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v: any) => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Content</Label><Textarea rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={v => setForm(f => ({ ...f, published: v }))} /><Label>Published</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Notice?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NoticeManager;
