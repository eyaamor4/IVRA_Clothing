import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { getOrders } from "@/lib/orders";

export const runtime = "nodejs";

// Renvoie l'identifiant de la commande la plus récente,
// pour que la page admin puisse détecter l'arrivée d'une nouvelle commande.
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const orders = await getOrders();
  const latest = orders[0];

  return NextResponse.json({
    id: latest?.id ?? null,
    count: orders.length,
  });
}