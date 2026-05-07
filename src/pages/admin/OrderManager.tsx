import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Phone, MessageCircle, Trash2, Clock, CheckCircle, XCircle, MapPinOff, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const allStatuses = [
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "accepted", label: "Accepted" },
  { value: "out_of_coverage", label: "Out of Coverage" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const OrderManager = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
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
    const filtered = filteredOrders;
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(o => o.id)));
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "contacted": return "bg-blue-100 text-blue-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "completed": return "bg-emerald-100 text-emerald-800";
      case "out_of_coverage": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const statusLabel = (s: string) => allStatuses.find(st => st.value === s)?.label || s;

  const countByStatus = (s: string) => orders.filter(o => o.status === s).length;

  const filteredOrders = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);

  const stats = [
    { label: "Total", value: orders.length, icon: Users, color: "text-primary" },
    { label: "Pending", value: countByStatus("pending"), icon: Clock, color: "text-yellow-600" },
    { label: "Accepted", value: countByStatus("accepted"), icon: CheckCircle, color: "text-green-600" },
    { label: "Out of Coverage", value: countByStatus("out_of_coverage"), icon: MapPinOff, color: "text-red-600" },
    { label: "Completed", value: countByStatus("completed"), icon: CheckCircle, color: "text-emerald-600" },
  ];

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Connection Orders</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus(s.label === "Total" ? "all" : s.label.toLowerCase().replace(/ /g, "_"))}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({orders.length})</SelectItem>
            {allStatuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label} ({countByStatus(s.value)})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Select onValueChange={bulkUpdateStatus}>
            <SelectTrigger className="w-[170px] h-8">
              <SelectValue placeholder="Set status..." />
            </SelectTrigger>
            <SelectContent>
              {allStatuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(Array.from(selected))}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <p className="text-muted-foreground">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={selected.size === filteredOrders.length && filteredOrders.length > 0} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => (
                <TableRow key={order.id} data-state={selected.has(order.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox checked={selected.has(order.id)} onCheckedChange={() => toggleSelect(order.id)} />
                  </TableCell>
                  <TableCell className="font-medium">{order.name}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{order.area || "—"}</TableCell>
                  <TableCell className="min-w-[260px] max-w-[420px] whitespace-normal break-words leading-relaxed">
                    {order.address || "—"}
                  </TableCell>
                  <TableCell>{order.packages?.name ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(order.created_at), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                      <SelectTrigger className="w-[150px]">
                        <Badge variant="secondary" className={statusColor(order.status)}>{statusLabel(order.status)}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {allStatuses.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
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
        </div>
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
