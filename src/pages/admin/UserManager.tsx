import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserManager = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("admin");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchRoles = async () => {
    const { data } = await supabase.from("user_roles").select("*");
    setRoles(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleAdd = async () => {
    setSaving(true);
    const { error } = await supabase.from("user_roles").insert([{ user_id: userId, role: role as "super_admin" | "admin" | "staff" }]);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Role assigned" });
    setSaving(false); setDialogOpen(false); setUserId(""); fetchRoles();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("user_roles").delete().eq("id", deleteId);
    setDeleteId(null); toast({ title: "Role removed" }); fetchRoles();
  };

  const roleColor = (r: string) => r === "super_admin" ? "bg-red-100 text-red-800" : r === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Roles</h2>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Assign Role</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        To add a user, first create them in Supabase Auth dashboard, then paste their User ID here.
      </p>
      <Table>
        <TableHeader><TableRow><TableHead>User ID</TableHead><TableHead>Role</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {roles.map(r => (
            <TableRow key={r.id}>
              <TableCell className="font-mono text-xs">{r.user_id}</TableCell>
              <TableCell><Badge variant="secondary" className={roleColor(r.role)}>{r.role}</Badge></TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Role</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>User ID (UUID)</Label><Input value={userId} onChange={e => setUserId(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" /></div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving || !userId}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove Role?</AlertDialogTitle><AlertDialogDescription>This user will lose admin access.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManager;
