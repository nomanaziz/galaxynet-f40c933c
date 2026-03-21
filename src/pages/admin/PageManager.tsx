import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const emptyPage = { slug: "", title: "", content: "", meta_title: "", meta_description: "", published: false };

const PageManager = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyPage);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetch = async () => { const { data } = await supabase.from("pages").select("*").order("created_at", { ascending: false }); setPages(data ?? []); setLoading(false); };
  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyPage); setDialogOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ slug: p.slug, title: p.title, content: p.content ?? "", meta_title: p.meta_title ?? "", meta_description: p.meta_description ?? "", published: p.published }); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("pages").update(form).eq("id", editing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Page updated" });
    } else {
      const { error } = await supabase.from("pages").insert(form);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Page created" });
    }
    setSaving(false); setDialogOpen(false); fetch();
  };

  const handleDelete = async () => { if (!deleteId) return; await supabase.from("pages").delete().eq("id", deleteId); setDeleteId(null); toast({ title: "Page deleted" }); fetch(); };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pages</h2>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Page</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Slug</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {pages.map(p => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell>/{p.slug}</TableCell>
              <TableCell><Badge variant={p.published ? "default" : "secondary"}>{p.published ? "Published" : "Draft"}</Badge></TableCell>
              <TableCell className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Page" : "Add Page"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="about-us" /></div>
            <div className="space-y-2"><Label>Content</Label><Textarea rows={8} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Meta Title</Label><Input value={form.meta_title} onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Meta Description</Label><Input value={form.meta_description} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={v => setForm(f => ({ ...f, published: v }))} /><Label>Published</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Page?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PageManager;
