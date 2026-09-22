import { NextResponse } from "next/server";
import { getProducts, adjustStock } from "@/lib/products";
import { sendNewOrderEmail } from "@/lib/email";
import { siteConfig } from "@/lib/config";
import { addOrder, generateOrderId } from "@/lib/orders";
import type { Order, OrderItem } from "@/types/order";

export const runtime = "nodejs";

const PHONE_REGEX = /^\+?[0-9 ]{8,15}$/;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (clean(body.website, 100)) {
    return NextResponse.json({ orderId: "CMD-OK" }, { status: 201 });
  }

  const fullName = clean(body.fullName, 100);
  const phone = clean(body.phone, 20);
  const address = clean(body.address, 250);
  const city = clean(body.city, 80);
  const notes = clean(body.notes, 500);

  if (fullName.length < 2)
    return NextResponse.json({ error: "Nom invalide." }, { status: 400 });
  if (!PHONE_REGEX.test(phone))
    return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
  if (address.length < 5)
    return NextResponse.json({ error: "Adresse trop courte." }, { status: 400 });
  if (city.length < 2)
    return NextResponse.json({ error: "Ville invalide." }, { status: 400 });

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
    return NextResponse.json({ error: "Panier vide ou invalide." }, { status: 400 });
  }

  const products = await getProducts();
  const items: OrderItem[] = [];
  for (const raw of body.items as Array<Record<string, unknown>>) {
    const productId = Number(raw?.id);
    const quantity = Number(raw?.quantity);
    const size = clean(raw?.size, 5);

    const product = products.find((p) => p.id === productId);
    const availableStock = product?.stock?.[size] ?? 0;

    if (
      !product ||
      !size ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99 ||
      availableStock < quantity
    ) {
      return NextResponse.json({ error: "Produit ou taille invalide/indisponible." }, { status: 400 });
    }
    items.push({ productId: product.id, name: product.name, price: product.price, quantity, size });
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = siteConfig.deliveryFee;

  const order: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: "new",
    customer: { fullName, phone, address, city, notes: notes || undefined },
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    paymentMethod: "cash_on_delivery",
  };

  try {
    await addOrder(order);
  } catch (err) {
    console.error("Erreur d'enregistrement de la commande :", err);
    return NextResponse.json({ error: "Impossible d'enregistrer la commande." }, { status: 500 });
  }

    // La commande est enregistrée : on réserve le stock correspondant.
  try {
    await adjustStock(
      items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
      -1
    );
  } catch (err) {
    // La commande est déjà enregistrée ; on log l'échec de mise à jour du stock
    // sans faire échouer la commande côté client.
    console.error("Erreur de mise à jour du stock après commande :", err);
  }

  // Notifie l'admin par email, sans bloquer la réponse au client si ça échoue.
  sendNewOrderEmail(order);

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}