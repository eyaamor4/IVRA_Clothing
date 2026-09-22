import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  checkPassword,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    /* corps invalide : mot de passe vide */
  }

  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // ralentit les essais en série
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions);
  return response;
}