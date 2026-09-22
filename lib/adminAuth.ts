import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 jours

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};

function secret(): string {
  const s = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD n'est pas défini dans .env.local");
  return s;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function createSessionToken(): string {
  const expires = String(Date.now() + MAX_AGE_SECONDS * 1000);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionToken(token?: string): boolean {
  if (!token) return false;
  try {
    const [expires, signature] = token.split(".");
    if (!expires || !signature) return false;
    if (Number(expires) < Date.now()) return false;
    return safeEqual(signature, sign(expires));
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}