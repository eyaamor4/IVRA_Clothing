import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const id = Number(productId);

  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Id invalide." }, { status: 400 });
  }

  try {
    const product = await getProduct(id);
    if (!product) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error("Erreur lecture produit :", err);
    return NextResponse.json({ error: "Impossible de charger le produit." }, { status: 500 });
  }
}
