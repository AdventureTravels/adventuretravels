/**
 * Concept-boeking tijdens de checkout, server-side bewaard in een gesigneerde
 * cookie (HMAC met SESSION_SECRET). Persoonsgegevens komen zo nooit in de URL,
 * en terugnavigeren tussen de stappen verliest niets.
 */
import crypto from "node:crypto";
import { cookies } from "next/headers";
import type { BookingAddress, ParticipantInput } from "@/lib/content/bookings";

export const CHECKOUT_COOKIE = "at_checkout";
const MAX_AGE = 60 * 60 * 6; // 6 uur

export type CheckoutStep1 = {
  departureId: string | null;
  arrivalDate: string | null; // YYYY-MM-DD, alleen individueel
  nights: number;
  persons: number;
  levels: string[]; // per persoon, index 0 = hoofdboeker
  extraIds: string[];
  flightRequested: boolean;
  departureAirport: string;
};

export type CheckoutStep2 = {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: BookingAddress;
  participants: ParticipantInput[];
};

export type CheckoutDraft = { slug: string; step1?: CheckoutStep1; step2?: CheckoutStep2 };

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return value;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export async function readCheckoutDraft(slug: string): Promise<CheckoutDraft> {
  const store = await cookies();
  const raw = store.get(CHECKOUT_COOKIE)?.value;
  if (!raw) return { slug };
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return { slug };
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { slug };
  try {
    const draft = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as CheckoutDraft;
    return draft.slug === slug ? draft : { slug };
  } catch {
    return { slug };
  }
}

export async function writeCheckoutDraft(draft: CheckoutDraft) {
  const payload = Buffer.from(JSON.stringify(draft)).toString("base64url");
  const store = await cookies();
  store.set(CHECKOUT_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearCheckoutDraft() {
  const store = await cookies();
  store.delete(CHECKOUT_COOKIE);
}
