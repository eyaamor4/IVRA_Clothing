import { createClient } from "@supabase/supabase-js";
import type { Order, OrderStatus } from "@/types/order";

// Stockage dans Supabase (Postgres). Toutes les fonctions ci-dessous sont
// les seules à connaître ce détail — le reste de l'app ne change pas.
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// La ligne telle que stockée en base (customer/items en JSON, colonnes en snake_case)
interface OrderRow {
  id: string;
  created_at: string;
  status: OrderStatus;
  customer: Order["customer"];
  items: Order["items"];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: Order["paymentMethod"];
}

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    customer: row.customer,
    items: row.items,
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    paymentMethod: row.payment_method,
  };
}

export function generateOrderId(): string {
  const d = new Date();
  const date = d.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CMD-${date}-${rand}`;
}

// Plus récentes en premier
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as OrderRow[]).map(rowToOrder);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToOrder(data as OrderRow) : undefined;
}

export async function addOrder(order: Order): Promise<Order> {
  const { error } = await supabase.from("orders").insert({
    id: order.id,
    created_at: order.createdAt,
    status: order.status,
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    total: order.total,
    payment_method: order.paymentMethod,
  });

  if (error) throw error;
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | undefined> {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data ? rowToOrder(data as OrderRow) : undefined;
}