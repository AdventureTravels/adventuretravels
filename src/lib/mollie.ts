import createMollieClient, { PaymentStatus, type Payment as MolliePayment } from "@mollie/api-client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { BOOKING_INCLUDE, type BookingWithRelations } from "@/lib/content/bookings";
import { sendBookingConfirmation, sendAdminBookingNotification, sendBankTransferInstructions } from "@/lib/email";

import { SITE_URL } from "@/lib/siteUrl";

/** Beleid: 100% vooruit via iDEAL, creditcard of bankoverschrijving. Andere methoden
 * uit het Mollie-profiel (bv. Klarna) worden niet aangeboden. */
export const ALLOWED_METHODS = ["ideal", "creditcard", "banktransfer"] as const;

export function isMollieConfigured() {
  return Boolean(process.env.MOLLIE_API_KEY);
}

let client: ReturnType<typeof createMollieClient> | null = null;
export function mollie() {
  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) throw new Error("MOLLIE_API_KEY is not set");
  client ??= createMollieClient({ apiKey });
  return client;
}

export type BankTransferDetails = {
  bankName?: string;
  bankAccount?: string;
  bankBic?: string;
  transferReference?: string;
};

/** Maakt een Mollie-betaling voor een boeking en slaat de Payment-rij op. Retourneert de checkout-URL. */
export async function createMolliePayment(booking: BookingWithRelations): Promise<string> {
  const amount = booking.totalAmount.toFixed(2);
  const payment = await mollie().payments.create({
    amount: { currency: "EUR", value: amount },
    description: `AdventureTravels ${booking.bookingNumber} — ${booking.trip.title}`,
    redirectUrl: `${SITE_URL}/boeken/bevestiging/${booking.bookingNumber}`,
    // Mollie weigert een webhook op localhost; lokaal synct de bevestigingspagina zelf.
    webhookUrl: /localhost|127\.0\.0\.1/.test(SITE_URL) ? undefined : `${SITE_URL}/api/mollie/webhook`,
    locale: "nl_NL" as never,
    metadata: { bookingId: booking.id, bookingNumber: booking.bookingNumber },
    billingEmail: booking.contactEmail,
    method: [...ALLOWED_METHODS],
  } as never);

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      molliePaymentId: payment.id,
      amount,
      status: payment.status,
      method: (payment.method as string | undefined) ?? null,
      raw: JSON.parse(JSON.stringify(payment)) as Prisma.InputJsonValue,
    },
  });

  const checkoutUrl = payment._links?.checkout?.href;
  if (!checkoutUrl) throw new Error("Mollie gaf geen checkout-URL terug.");
  return checkoutUrl;
}

/**
 * Haalt de betaling bij Mollie op (nooit vertrouwen op de webhook-body),
 * werkt de Payment-rij bij en verwerkt statusovergangen precies één keer:
 * paid → boeking "paid" + bevestigingsmail + adminmail;
 * open + banktransfer → mail met betaalinstructies.
 */
export async function syncPaymentFromMollie(molliePaymentId: string): Promise<{ payment: MolliePayment; booking: BookingWithRelations | null }> {
  const payment = await mollie().payments.get(molliePaymentId);
  const existing = await prisma.payment.findUnique({ where: { molliePaymentId } });
  if (!existing) {
    console.warn(`Mollie-webhook voor onbekende betaling ${molliePaymentId}`);
    return { payment, booking: null };
  }

  const method = (payment.method as string | undefined) ?? existing.method ?? null;
  await prisma.payment.update({
    where: { molliePaymentId },
    data: {
      status: payment.status,
      method,
      paidAt: payment.paidAt ? new Date(payment.paidAt) : existing.paidAt,
      raw: JSON.parse(JSON.stringify(payment)) as Prisma.InputJsonValue,
    },
  });

  let booking = await prisma.booking.findUnique({ where: { id: existing.bookingId }, include: BOOKING_INCLUDE });
  if (!booking) return { payment, booking: null };

  if (payment.status === PaymentStatus.paid && booking.status === "pending_payment") {
    // updateMany met statusvoorwaarde: bij twee gelijktijdige webhooks wint er precies één.
    const { count } = await prisma.booking.updateMany({
      where: { id: booking.id, status: "pending_payment" },
      data: { status: "paid" },
    });
    booking = (await prisma.booking.findUnique({ where: { id: booking.id }, include: BOOKING_INCLUDE }))!;
    if (count === 1) {
      // De boeking is betaald; een mailfout mag dat niet terugdraaien of de webhook laten falen.
      const results = await Promise.allSettled([sendBookingConfirmation(booking), sendAdminBookingNotification(booking)]);
      const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
      if (failed.length > 0) {
        const reason = failed.map((f) => (f.reason instanceof Error ? f.reason.message : String(f.reason))).join("; ");
        console.error(`Mail na betaling ${booking.bookingNumber} mislukt:`, reason);
        await prisma.booking.update({
          where: { id: booking.id },
          data: { notes: `${booking.notes ? booking.notes + "\n" : ""}Let op: bevestigings-/adminmail mislukt (${reason}). Handmatig versturen.` },
        });
        booking = (await prisma.booking.findUnique({ where: { id: booking.id }, include: BOOKING_INCLUDE }))!;
      }
    }
  } else if (
    payment.status === PaymentStatus.open &&
    method === "banktransfer" &&
    existing.method !== "banktransfer" &&
    booking.status === "pending_payment"
  ) {
    try {
      await sendBankTransferInstructions(booking, (payment.details ?? {}) as BankTransferDetails, payment.expiresAt ?? null);
    } catch (error) {
      console.error(`Betaalinstructies ${booking.bookingNumber} mailen mislukt:`, error);
    }
  }

  return { payment, booking };
}

export async function cancelMolliePaymentIfOpen(molliePaymentId: string) {
  try {
    const payment = await mollie().payments.get(molliePaymentId);
    if (payment.isCancelable) await mollie().payments.cancel(molliePaymentId);
  } catch (error) {
    console.warn(`Mollie-betaling ${molliePaymentId} niet geannuleerd:`, error);
  }
}

export type MollieMethodInfo = { id: string; description: string; imageSvg: string };

let methodsCache: { at: number; methods: MollieMethodInfo[] } | null = null;

/** Actieve betaalmethoden met de officiële Mollie-afbeeldingen; een uur gecachet. */
export async function listMollieMethods(): Promise<MollieMethodInfo[]> {
  if (!isMollieConfigured()) return [];
  if (methodsCache && Date.now() - methodsCache.at < 60 * 60 * 1000) return methodsCache.methods;
  try {
    const methods = await mollie().methods.list({ locale: "nl_NL" as never });
    const list = methods
      .filter((m) => (ALLOWED_METHODS as readonly string[]).includes(m.id as string))
      .sort((a, b) => ALLOWED_METHODS.indexOf(a.id as never) - ALLOWED_METHODS.indexOf(b.id as never))
      .map((m) => ({ id: m.id as string, description: m.description, imageSvg: m.image.svg }));
    methodsCache = { at: Date.now(), methods: list };
    return list;
  } catch (error) {
    console.warn("Mollie-methoden niet opgehaald:", error);
    return methodsCache?.methods ?? [];
  }
}
