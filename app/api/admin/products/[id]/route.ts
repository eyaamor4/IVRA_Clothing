import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { updateProduct, deleteProduct } from "@/lib/products";
import { SIZES } from "@/types/product";

export const runtime = "nodejs";

function validateStock(raw: unknown): Record<string, number> | null {
  if (typeof raw !== "object" || raw === null) return null;
  const stock: Record<string, number> = {};
  for (const size of SIZES) {
    const v = Number((raw as Record<string, unknown>)[size]);
    if (!Number.isInteger(v) || v < 0) return null;
    stock[size] = v;
  }
  return stock;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: "Id invalide." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const price = Number(body.price);
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : null;
  const stock = validateStock(body.stock);

  if (name.length < 2) return NextResponse.json({ error: "Nom invalide." }, { status: 400 });
  if (!Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
  if (!image) return NextResponse.json({ error: "Image manquante." }, { status: 400 });
  if (!stock) return NextResponse.json({ error: "Stock invalide." }, { status: 400 });

  try {
    const product = await updateProduct(productId, { name, price, image, description, stock });
    return NextResponse.json(product);
  } catch (err) {
    console.error("Erreur modification produit :", err);
    return NextResponse.json({ error: "Impossible de modifier le produit." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: "Id invalide." }, { status: 400 });
  }

  try {
    await deleteProduct(productId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur suppression produit :", err);
    return NextResponse.json({ error: "Impossible de supprimer le produit." }, { status: 500 });
  }
}