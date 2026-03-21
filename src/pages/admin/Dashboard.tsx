import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/admin/StatsCard";
import { ShoppingCart, Package, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({ orders: 0, packages: 0, areas: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, packagesRes, areasRes, pendingRes] = await Promise.all([
        supabase.from("connection_orders").select("*", { count: "exact", head: true }),
        supabase.from("packages").select("*", { count: "exact", head: true }),
        supabase.from("coverage_areas").select("*", { count: "exact", head: true }),
        supabase.from("connection_orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({
        orders: ordersRes.count ?? 0,
        packages: packagesRes.count ?? 0,
        areas: areasRes.count ?? 0,
        pending: pendingRes.count ?? 0,
      });
    };

    const fetchRecent = async () => {
      const { data } = await supabase
        .from("connection_orders")
        .select("*, packages(name)")
        .order("created_at", { ascending: false })
        .limit(10);
      setRecentOrders(data ?? []);
    };

    const fetchChart = async () => {
      const { data } = await supabase.from("connection_orders").select("status");
      const counts = { pending: 0, contacted: 0, completed: 0 };
      (data ?? []).forEach((o: any) => {
        if (o.status in counts) counts[o.status as keyof typeof counts]++;
      });
      setChartData([
        { name: "Pending", count: counts.pending },
        { name: "Contacted", count: counts.contacted },
        { name: "Completed", count: counts.completed },
      ]);
    };

    fetchStats();
    fetchRecent();
    fetchChart();
  }, []);

  const statusColor = (s: string) => {
    if (s === "pending") return "bg-yellow-100 text-yellow-800";
    if (s === "contacted") return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Orders" value={stats.orders} icon={ShoppingCart} />
        <StatsCard title="Active Packages" value={stats.packages} icon={Package} />
        <StatsCard title="Coverage Areas" value={stats.areas} icon={MapPin} />
        <StatsCard title="Pending Orders" value={stats.pending} icon={Clock} description="Awaiting contact" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.name}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
