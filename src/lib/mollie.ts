import createMollieClient, { PaymentStatus, type Payment as MolliePayment } from "@mollie/api-client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { BOOKING_INCLUDE, type BookingWithRelations } from "@/lib/content/bookings";
import { sendBookingConfirmation, sendAdminBookingNotification, sendBankTransferInstructions } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adventuretravels.nl";

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
    webhookUrl: `${SITE_URL}/api/mollie/webhook`,
    locale: "nl_NL" as never,
    metadata: { bookingId: booking.id, bookingNumber: booking.bookingNumber },
    billingEmail: booking.contactEmail,
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
      await Promise.all([sendBookingConfirmation(booking), sendAdminBookingNotification(booking)]);
    }
  } else if (
    payment.status === PaymentStatus.open &&
    method === "banktransfer" &&
    existing.method !== "banktransfer" &&
    booking.status === "pending_payment"
  ) {
    await sendBankTransferInstructions(booking, (payment.details ?? {}) as BankTransferDetails, payment.expiresAt ?? null);
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
    const list = methods.map((m) => ({ id: m.id as string, description: m.description, imageSvg: m.image.svg }));
    methodsCache = { at: Date.now(), methods: list };
    return list;
  } catch (error) {
    console.warn("Mollie-methoden niet opgehaald:", error);
    return methodsCache?.methods ?? [];
  }
}
