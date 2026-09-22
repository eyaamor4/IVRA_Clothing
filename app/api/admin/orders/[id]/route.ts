import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { adjustStock } from "@/lib/products";
import type { OrderStatus } from "@/types/order";

export const runtime = "nodejs";

const STATUSES: OrderStatus[] = ["new", "confirmed", "delivered", "cancelled"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  let status: unknown;
  try {
    status = (await request.json()).status;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const previous = await getOrder(id);
  if (!previous) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }

  const order = await updateOrderStatus(id, status as OrderStatus);
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }

  const wasCancelled = previous.status === "cancelled";
  const isCancelled = order.status === "cancelled";

  try {
    if (!wasCancelled && isCancelled) {
      // La commande vient d'être annulée : on remet le stock à disposition.
      await adjustStock(
        order.items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
        1
      );
    } else if (wasCancelled && !isCancelled) {
      // Une commande annulée est réactivée : on reprend le stock correspondant.
      await adjustStock(
        order.items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
        -1
      );
    }
  } catch (err) {
    console.error("Erreur de mise à jour du stock après changement de statut :", err);
  }

  return NextResponse.json({ order });
}