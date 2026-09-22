import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (err) {
    console.error("Erreur de récupération des produits :", err);
    return NextResponse.json(
      { error: "Impossible de récupérer les produits." },
      { status: 500 }
    );
  }
}