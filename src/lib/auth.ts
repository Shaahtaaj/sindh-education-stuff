import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE_NAME = "ses_admin";
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? "development-secret-change-before-deploy");

export type AdminPayload = { sub: string; email: string; role: "super_admin" | "editor" | "order_manager" };

export async function createToken(payload: AdminPayload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(secret());
}
export async function verifyToken(token: string) {
  try { return (await jwtVerify(token, secret())).payload as AdminPayload; } catch { return null; }
}
export async function getSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : null;
}
