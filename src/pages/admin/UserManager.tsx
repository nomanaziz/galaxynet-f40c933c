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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Loader2, Shield, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ALL_PERMISSIONS } from "@/lib/adminPermissions";

interface StaffUser {
  id: string;
  user_id: string;
  role: string;
  email?: string;
  name?: string;
  permissionCount: number;
}

const UserManager = () => {
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [permDialogOpen, setPermDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Add staff form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("staff");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  // Permission editing
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [editPerms, setEditPerms] = useState<string[]>([]);
  const [savingPerms, setSavingPerms] = useState(false);

  const { toast } = useToast();

  const fetchStaffUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("list-staff-users");
    if (error || !data?.users) {
      // Fallback: roles only (no email)
      const { data: roles } = await supabase.from("user_roles").select("*");
      const { data: perms } = await supabase.from("staff_permissions").select("user_id, permission");
      const permMap: Record<string, number> = {};
      perms?.forEach(p => { permMap[p.user_id] = (permMap[p.user_id] || 0) + 1; });
      setStaffUsers((roles ?? []).map((r: any) => ({
        id: r.id, user_id: r.user_id, role: r.role,
        permissionCount: permMap[r.user_id] || 0,
      })));
    } else {
      setStaffUsers(data.users);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStaffUsers(); }, []);

  const handleAdd = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-staff-user", {
        body: { email, password, name, role, permissions: selectedPerms },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      toast({ title: "স্টাফ তৈরি হয়েছে", description: `${email} কে ${role} হিসেবে যোগ করা হয়েছে` });
      setDialogOpen(false);
      setEmail(""); setPassword(""); setName(""); setRole("staff"); setSelectedPerms([]);
      fetchStaffUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const user = staffUsers.find(u => u.id === deleteId);
    if (user) {
      await supabase.from("staff_permissions").delete().eq("user_id", user.user_id);
    }
    await supabase.from("user_roles").delete().eq("id", deleteId);
    setDeleteId(null);
    toast({ title: "রোল মুছে ফেলা হয়েছে" });
    fetchStaffUsers();
  };

  const openPermDialog = async (user: StaffUser) => {
    setEditingUser(user);
    const { data } = await supabase
      .from("staff_permissions")
      .select("permission")
      .eq("user_id", user.user_id);
    setEditPerms(data?.map(p => p.permission) ?? []);
    setPermDialogOpen(true);
  };

  const savePermissions = async () => {
    if (!editingUser) return;
    setSavingPerms(true);
    // Delete existing, insert new
    await supabase.from("staff_permissions").delete().eq("user_id", editingUser.user_id);
    if (editPerms.length > 0) {
      await supabase.from("staff_permissions").insert(
        editPerms.map(p => ({ user_id: editingUser.user_id, permission: p }))
      );
    }
    toast({ title: "পারমিশন আপডেট হয়েছে" });
    setSavingPerms(false);
    setPermDialogOpen(false);
    fetchStaffUsers();
  };

  const togglePerm = (key: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(key) ? list.filter(k => k !== key) : [...list, key]);
  };

  const roleColor = (r: string) =>
    r === "super_admin" ? "bg-red-100 text-red-800" :
    r === "admin" ? "bg-blue-100 text-blue-800" :
    r === "supervisor" ? "bg-amber-100 text-amber-800" :
    "bg-gray-100 text-gray-800";

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">স্টাফ ম্যানেজমেন্ট</h2>
          <p className="text-sm text-muted-foreground mt-1">
            স্টাফ এবং সুপারভাইজর অ্যাকাউন্ট তৈরি করুন এবং তাদের পারমিশন নিয়ন্ত্রণ করুন
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />স্টাফ যোগ করুন
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffUsers.map(u => (
            <TableRow key={u.id}>
              <TableCell className="font-mono text-xs">{u.user_id}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={roleColor(u.role)}>{u.role}</Badge>
              </TableCell>
              <TableCell>
                {["super_admin", "admin"].includes(u.role)
                  ? <span className="text-sm text-muted-foreground">Full Access</span>
                  : <span className="text-sm">{u.permissionCount} sections</span>
                }
              </TableCell>
              <TableCell className="flex gap-1">
                {!["super_admin", "admin"].includes(u.role) && (
                  <Button variant="ghost" size="icon" onClick={() => openPermDialog(u)} title="Manage Permissions">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(u.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {staffUsers.length === 0 && (
            <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">কোনো স্টাফ নেই</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Staff Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>নতুন স্টাফ যোগ করুন</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>নাম</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="নাম লিখুন" />
            </div>
            <div className="space-y-2">
              <Label>ইমেইল</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label>পাসওয়ার্ড</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" />
            </div>
            <div className="space-y-2">
              <Label>রোল</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role !== "admin" && (
              <div className="space-y-2">
                <Label>পারমিশনসমূহ</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                  {ALL_PERMISSIONS.map(p => (
                    <label key={p.key} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={selectedPerms.includes(p.key)}
                        onCheckedChange={() => togglePerm(p.key, selectedPerms, setSelectedPerms)}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>বাতিল</Button>
            <Button onClick={handleAdd} disabled={saving || !email || !password}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              তৈরি করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={permDialogOpen} onOpenChange={setPermDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              পারমিশন ম্যানেজ করুন
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border rounded-md p-3">
            {ALL_PERMISSIONS.map(p => (
              <label key={p.key} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={editPerms.includes(p.key)}
                  onCheckedChange={() => togglePerm(p.key, editPerms, setEditPerms)}
                />
                {p.label}
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermDialogOpen(false)}>বাতিল</Button>
            <Button onClick={savePermissions} disabled={savingPerms}>
              {savingPerms && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              সংরক্ষণ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>রোল মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription>এই ব্যবহারকারী অ্যাডমিন অ্যাক্সেস হারাবে।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>মুছে ফেলুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManager;
