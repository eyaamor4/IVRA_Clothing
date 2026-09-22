import LogoutButton from "@/components/admin/LogoutButton";
import StatsCards from "@/components/admin/StatsCards";
import NewOrderWatcher from "@/components/admin/NewOrderWatcher";
import AdminNav from "@/components/admin/AdminNav";
import OrderActions from "@/components/admin/OrderActions";
import { STATUS_COLORS, STATUS_LABELS } from "@/components/admin/orderStatus";
import { Card, CardContent } from "@/components/ui/card";
import { isAdmin } from "@/lib/adminAuth";
import { formatPrice } from "@/lib/config";
import { getOrders } from "@/lib/orders";
import type { OrderStatus } from "@/types/order";
import Link from "next/link";
import { redirect } from "next/navigation";


export const metadata = {
  title: "Commandes",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const FILTERS: Array<{ value: "all" | OrderStatus; label: string }> = [
  { value: "all", label: "Toutes" },
  { value: "new", label: STATUS_LABELS.new },
  { value: "confirmed", label: STATUS_LABELS.confirmed },
  { value: "delivered", label: STATUS_LABELS.delivered },
  { value: "cancelled", label: STATUS_LABELS.cancelled },
];

export default async function AdminPage({
   searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

    const { status, q } = await searchParams;
  const all = await getOrders();
  const filter = FILTERS.find((f) => f.value === status)?.value ?? "all";

  let orders = filter === "all" ? all : all.filter((o) => o.status === filter);

  const query = q?.trim().toLowerCase();
  if (query) {
    orders = orders.filter((o) => {
      const haystack = [
        o.id,
        o.customer.fullName,
        o.customer.phone,
        o.customer.city,
        ...o.items.map((i) => i.name),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AdminNav />

            <StatsCards orders={all} />

      <NewOrderWatcher latestOrderId={all[0]?.id ?? null} />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Commandes ({orders.length})</h1>        <LogoutButton />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => {
          const count =
            f.value === "all"
              ? all.length
              : all.filter((o) => o.status === f.value).length;
          return (
                       <Link
              key={f.value}
              href={
                f.value === "all"
                  ? query
                    ? `/admin?q=${encodeURIComponent(query)}`
                    : "/admin"
                  : query
                  ? `/admin?status=${f.value}&q=${encodeURIComponent(query)}`
                  : `/admin?status=${f.value}`
              }
              className={`px-3 py-1.5 rounded-full text-sm border ${
                filter === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted"
              }`}
            >
              {f.label} ({count})
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">Aucune commande.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">Livraison</p>
                    <p>{order.customer.fullName}</p>
                                     <p>
                      <Link href={"tel:" + order.customer.phone.split(" ").join("")} className="text-primary underline">{order.customer.phone}</Link>
                    </p>
                    <p>
                      {order.customer.address}, {order.customer.city}
                    </p>
                    {order.customer.notes && (
                      <p className="text-muted-foreground">
                        Remarque : {order.customer.notes}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium">Articles</p>
                                        <ul>
                      {order.items.map((item) => (
                        <li key={item.productId + item.size}>
                          {item.name} ({item.size}) × {item.quantity}
                        </li>
                      ))}
                    </ul>
                    <p className="pt-2 font-semibold">
                      À encaisser : {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                <OrderActions order={order} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}