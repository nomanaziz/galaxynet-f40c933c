import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ExternalLink, Eye, EyeOff, Upload, Loader2 } from "lucide-react";

interface FtpServer {
  id: string;
  name: string;
  category: string;
  logo_url: string | null;
  link: string;
  sort_order: number;
  visible: boolean;
}

const defaultServer: Omit<FtpServer, "id"> = {
  name: "",
  category: "ftp",
  logo_url: "",
  link: "",
  sort_order: 0,
  visible: true,
};

export default function FtpServerManager() {
  const [servers, setServers] = useState<FtpServer[]>([]);
  const [noticeText, setNoticeText] = useState("");
  const [helpline, setHelpline] = useState("");
  const [editing, setEditing] = useState<Partial<FtpServer> & typeof defaultServer>(defaultServer);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `ftp-logos/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("media").upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
      setEditing(p => ({ ...p, logo_url: publicUrl }));
      toast({ title: "Logo uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const fetchAll = async () => {
    const [{ data: srv }, { data: stg }] = await Promise.all([
      supabase.from("ftp_servers").select("*").order("sort_order"),
      supabase.from("ftp_page_settings").select("*"),
    ]);
    setServers((srv as FtpServer[]) ?? []);
    const map: Record<string, string> = {};
    (stg ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
    setNoticeText(map.notice_text ?? "");
    setHelpline(map.helpline ?? "");
  };

  useEffect(() => { fetchAll(); }, []);

  const saveSettings = async () => {
    await Promise.all([
      supabase.from("ftp_page_settings").update({ value: noticeText }).eq("key", "notice_text"),
      supabase.from("ftp_page_settings").update({ value: helpline }).eq("key", "helpline"),
    ]);
    toast({ title: "সেটিংস সংরক্ষিত হয়েছে" });
  };

  const saveServer = async () => {
    if (!editing.name || !editing.link) {
      toast({ title: "নাম এবং লিংক আবশ্যক", variant: "destructive" });
      return;
    }
    const payload = {
      name: editing.name,
      category: editing.category,
      logo_url: editing.logo_url || null,
      link: editing.link,
      sort_order: editing.sort_order,
      visible: editing.visible,
    };
    if (isEdit && editing.id) {
      await supabase.from("ftp_servers").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("ftp_servers").insert(payload);
    }
    setDialogOpen(false);
    setEditing(defaultServer);
    fetchAll();
    toast({ title: isEdit ? "আপডেট হয়েছে" : "যোগ করা হয়েছে" });
  };

  const deleteServer = async (id: string) => {
    await supabase.from("ftp_servers").delete().eq("id", id);
    fetchAll();
    toast({ title: "মুছে ফেলা হয়েছে" });
  };

  const toggleVisibility = async (server: FtpServer) => {
    await supabase.from("ftp_servers").update({ visible: !server.visible }).eq("id", server.id);
    fetchAll();
  };

  const openAdd = () => { setEditing(defaultServer); setIsEdit(false); setDialogOpen(true); };
  const openEdit = (s: FtpServer) => { setEditing(s); setIsEdit(true); setDialogOpen(true); };

  const categoryLabel: Record<string, string> = { ftp: "FTP/Movie", ott: "OTT", livetv: "Live TV" };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">FTP/OTT Server Manager</h1>

      {/* Page Settings */}
      <Card>
        <CardHeader><CardTitle>Page Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Notice Text (Top Banner)</Label>
            <Input value={noticeText} onChange={e => setNoticeText(e.target.value)} />
          </div>
          <div>
            <Label>Helpline Number</Label>
            <Input value={helpline} onChange={e => setHelpline(e.target.value)} />
          </div>
          <Button onClick={saveSettings}>Save Settings</Button>
          <a href="/ftp" target="_blank" rel="noopener noreferrer" className="ml-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-4 w-4" /> Preview Page
          </a>
        </CardContent>
      </Card>

      {/* Server List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Servers ({servers.length})</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Server</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEdit ? "Edit Server" : "Add Server"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={editing.name} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={editing.category} onValueChange={v => setEditing(p => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ftp">FTP / Movie</SelectItem>
                      <SelectItem value="ott">OTT</SelectItem>
                      <SelectItem value="livetv">Live TV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Logo</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {editing.logo_url && (
                      <img src={editing.logo_url} alt="Preview" className="h-10 w-10 rounded object-contain border" />
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                      Upload
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 my-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">or paste URL</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <Input value={editing.logo_url ?? ""} onChange={e => setEditing(p => ({ ...p, logo_url: e.target.value }))} placeholder="https://..." />
                </div>
                <div>
                  <Label>Link</Label>
                  <Input value={editing.link} onChange={e => setEditing(p => ({ ...p, link: e.target.value }))} placeholder="http://..." />
                </div>
                <div>
                  <Label>Sort Order</Label>
                  <Input type="number" value={editing.sort_order} onChange={e => setEditing(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
                </div>
                <Button onClick={saveServer} className="w-full">{isEdit ? "Update" : "Add"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servers.map(s => (
                <TableRow key={s.id} className={!s.visible ? "opacity-50" : ""}>
                  <TableCell>
                    {s.logo_url ? <img src={s.logo_url} alt={s.name} className="h-8 w-8 rounded object-contain" /> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{categoryLabel[s.category] ?? s.category}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs">{s.link}</TableCell>
                  <TableCell>{s.sort_order}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => toggleVisibility(s)}>
                      {s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(s)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteServer(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {servers.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No servers added yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
