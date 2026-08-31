import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE = "at_admin_session";

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return value;
}

function sign(email: string) {
  return crypto.createHmac("sha256", secret()).update(email).digest("hex");
}

export function createSessionToken(email: string) {
  return `${Buffer.from(email).toString("base64url")}.${sign(email)}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const [encodedEmail, signature] = token.split(".");
  if (!encodedEmail || !signature) return null;
  const email = Buffer.from(encodedEmail, "base64url").toString("utf8");
  const expected = sign(email);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return email;
}

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}

export async function getSessionEmail() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie(email: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
