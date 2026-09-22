import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/config";
import type { Order } from "@/types/order";
import { Clock, Package, TrendingUp, Wallet } from "lucide-react";

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function StatsCards({ orders }: { orders: Order[] }) {
  const active = orders.filter((o) => o.status !== "cancelled");
  const todayOrders = active.filter((o) => isToday(o.createdAt));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const totalRevenue = active.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "new").length;

  const stats = [
    {
      label: "Commandes aujourd'hui",
      value: String(todayOrders.length),
      icon: Package,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Encaissé aujourd'hui",
      value: formatPrice(todayRevenue),
      icon: Wallet,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Total encaissé",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: "text-primary bg-accent",
    },
    {
      label: "En attente",
      value: String(pendingCount),
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
              <p className="text-lg font-bold text-foreground truncate">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}