/**
 * Stateless reviewtoken: gesigneerd boekings-id, zodat de reviewmail geen
 * lege Review-rij hoeft aan te maken. Bij het insturen wordt het token als
 * Review.token opgeslagen (uniek), dus één review per boeking.
 */
import crypto from "node:crypto";

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return value;
}

function sign(bookingId: string) {
  return crypto.createHmac("sha256", secret()).update(`review:${bookingId}`).digest("base64url");
}

export function createReviewToken(bookingId: string): string {
  return `${Buffer.from(bookingId).toString("base64url")}.${sign(bookingId)}`;
}

export function verifyReviewToken(token: string): string | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const bookingId = Buffer.from(encoded, "base64url").toString("utf8");
  const expected = sign(bookingId);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return bookingId;
}
