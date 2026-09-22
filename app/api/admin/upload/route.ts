import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { uploadProductImage } from "@/lib/products";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image trop lourde (max 5 Mo)." }, { status: 400 });
  }

  try {
    const url = await uploadProductImage(file);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Erreur upload image :", err);
    return NextResponse.json({ error: "Échec de l'upload." }, { status: 500 });
  }
}