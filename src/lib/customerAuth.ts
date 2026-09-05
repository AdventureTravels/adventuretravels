import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { createSessionToken, verifySessionToken } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";

export const CUSTOMER_SESSION_COOKIE = "at_customer_session";
const TOKEN_TTL_MINUTES = 30;
import { PORTAL_URL } from "@/lib/siteUrl";

export async function requestMagicLink(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);
  await prisma.customerMagicLinkToken.create({ data: { email: normalized, token, expiresAt } });

  const url = `${PORTAL_URL}/verify?token=${token}`;
  await sendMagicLinkEmail(normalized, url);
}

export async function verifyMagicLinkToken(token: string): Promise<string | null> {
  const record = await prisma.customerMagicLinkToken.findUnique({ where: { token } });
  if (!record) return null;
  if (record.usedAt) return null;
  if (record.expiresAt < new Date()) return null;

  await prisma.customerMagicLinkToken.update({ where: { token }, data: { usedAt: new Date() } });
  return record.email;
}

export async function setCustomerSessionCookie(email: string) {
  const store = await cookies();
  store.set(CUSTOMER_SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getCustomerEmail() {
  const store = await cookies();
  return verifySessionToken(store.get(CUSTOMER_SESSION_COOKIE)?.value);
}

export async function clearCustomerSessionCookie() {
  const store = await cookies();
  store.delete(CUSTOMER_SESSION_COOKIE);
}
