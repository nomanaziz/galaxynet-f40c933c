import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, Phone, MessageCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OrderManager = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("connection_orders")
      .select("*, packages(name)")
      .order("created_at", { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("connection_orders").update({ status: status as any }).eq("id", id);
    toast({ title: `Status updated to ${status}` });
    fetchOrders();
  };

  const bulkUpdateStatus = async (status: string) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    for (const id of ids) {
      await supabase.from("connection_orders").update({ status: status as any }).eq("id", id);
    }
    setSelected(new Set());
    toast({ title: `${ids.length} orders updated to ${status}` });
    fetchOrders();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ids = Array.isArray(deleteTarget) ? deleteTarget : [deleteTarget];
    for (const id of ids) {
      await supabase.from("connection_orders").delete().eq("id", id);
    }
    setSelected(new Set());
    setDeleteTarget(null);
    toast({ title: `${ids.length} order(s) deleted` });
    fetchOrders();
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === orders.length) setSelected(new Set());
    else setSelected(new Set(orders.map(o => o.id)));
  };

  const statusColor = (s: string) => {
    if (s === "pending") return "bg-yellow-100 text-yellow-800";
    if (s === "contacted") return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Connection Orders</h2>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Select onValueChange={bulkUpdateStatus}>
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Set status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(Array.from(selected))}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox checked={selected.size === orders.length && orders.length > 0} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id} data-state={selected.has(order.id) ? "selected" : undefined}>
                <TableCell>
                  <Checkbox checked={selected.has(order.id)} onCheckedChange={() => toggleSelect(order.id)} />
                </TableCell>
                <TableCell className="font-medium">{order.name}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell className="max-w-[200px] truncate">{order.address}</TableCell>
                <TableCell>{order.packages?.name ?? "—"}</TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                    <SelectTrigger className="w-[130px]">
                      <Badge variant="secondary" className={statusColor(order.status)}>{order.status}</Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`tel:${order.phone}`}><Phone className="h-4 w-4" /></a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`https://wa.me/${order.phone?.replace(/[^0-9]/g, "")}`} target="_blank"><MessageCircle className="h-4 w-4" /></a>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(order.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {Array.isArray(deleteTarget) ? `${deleteTarget.length} orders` : "this order"}?</AlertDialogTitle>
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

export default OrderManager;
