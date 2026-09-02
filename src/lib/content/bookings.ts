import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { randomBytes } from "node:crypto";
import type { CancellationTier } from "@/lib/cancellation";

export const BOOKING_INCLUDE = {
  trip: { include: { partner: true, sport: true, destination: true } },
  departure: true,
  participants: { orderBy: { order: "asc" as const } },
  invoices: { orderBy: { issuedAt: "asc" as const } },
  payments: { orderBy: { createdAt: "desc" as const } },
} satisfies Prisma.BookingInclude;

export type BookingWithRelations = Prisma.BookingGetPayload<{ include: typeof BOOKING_INCLUDE }>;

export function getBookings(where: Prisma.BookingWhereInput = {}) {
  return prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { trip: true, payments: { orderBy: { createdAt: "desc" } } },
  });
}

export function getBookingById(id: string) {
  return prisma.booking.findUnique({ where: { id }, include: BOOKING_INCLUDE });
}

export function getBookingByNumber(bookingNumber: string) {
  return prisma.booking.findUnique({ where: { bookingNumber }, include: BOOKING_INCLUDE });
}

export function getBookingsByEmail(email: string) {
  return prisma.booking.findMany({
    where: { contactEmail: { equals: email, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    include: { trip: true, payments: { orderBy: { createdAt: "desc" } } },
  });
}

export async function generateBookingNumber() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
    const bookingNumber = `AT-${code}`;
    const existing = await prisma.booking.findUnique({ where: { bookingNumber } });
    if (!existing) return bookingNumber;
  }
  throw new Error("Kon geen uniek boekingsnummer genereren.");
}

export type PriceLine = { label: string; qty: number; unitAmount: string; amount: string };
export type BookingExtraLine = { extraId: string; name: string; pricePp: string; qty: number };
export type BookingAddress = { street: string; houseNumber: string; postalCode: string; city: string; country: string };

export type BookingInput = {
  tripId: string;
  departureId: string | null;
  arrivalDate: Date;
  nights: number;
  flightRequested: boolean;
  departureAirport: string | null;
  extras: BookingExtraLine[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: BookingAddress;
  priceBreakdown: PriceLine[];
  totalAmount: string;
  cancellationPolicySnapshot: CancellationTier[];
  termsAcceptedAt: Date;
  cancellationTermsAcceptedAt: Date;
  participants: ParticipantInput[];
};

/** Statussen waarvoor de klant de voorwaarden moet hebben geaccepteerd. */
export const ACTIVE_STATUSES = ["pending_payment", "paid", "confirmed"] as const;

/**
 * Zelfde regel als de CHECK-constraint "Booking_terms_required_for_active_status":
 * een actieve status vereist beide acceptatie-tijdstippen. Gooit een fout.
 */
export function assertTermsForStatus(
  status: string,
  terms: { termsAcceptedAt: Date | null; cancellationTermsAcceptedAt: Date | null }
) {
  if (!(ACTIVE_STATUSES as readonly string[]).includes(status)) return;
  if (!terms.termsAcceptedAt || !terms.cancellationTermsAcceptedAt) {
    throw new Error(
      `Boeking kan niet op "${status}": algemene voorwaarden en annuleringsvoorwaarden zijn niet (beide) geaccepteerd.`
    );
  }
}

export async function createBooking(data: BookingInput) {
  assertTermsForStatus("pending_payment", data);
  const bookingNumber = await generateBookingNumber();
  const { participants, ...rest } = data;
  return prisma.booking.create({
    data: {
      ...rest,
      bookingNumber,
      extras: rest.extras as unknown as Prisma.InputJsonValue,
      contactAddress: rest.contactAddress as unknown as Prisma.InputJsonValue,
      priceBreakdown: rest.priceBreakdown as unknown as Prisma.InputJsonValue,
      cancellationPolicySnapshot: rest.cancellationPolicySnapshot as unknown as Prisma.InputJsonValue,
      participants: { create: participants.map((p, order) => ({ ...p, order })) },
    },
    include: BOOKING_INCLUDE,
  });
}

export async function updateBookingStatus(id: string, status: string) {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id },
    select: { termsAcceptedAt: true, cancellationTermsAcceptedAt: true },
  });
  assertTermsForStatus(status, booking);
  return prisma.booking.update({ where: { id }, data: { status } });
}

export function updateBookingNotes(id: string, notes: string | null) {
  return prisma.booking.update({ where: { id }, data: { notes } });
}

export function deleteBooking(id: string) {
  return prisma.booking.delete({ where: { id } });
}

export type ParticipantInput = {
  firstName: string;
  lastName: string;
  birthdate?: string | null;
  level?: string | null;
  dietaryNotes?: string | null;
};

export function setBookingParticipants(bookingId: string, participants: ParticipantInput[]) {
  return prisma.$transaction([
    prisma.participant.deleteMany({ where: { bookingId } }),
    prisma.participant.createMany({
      data: participants.map((p, order) => ({ ...p, bookingId, order })),
    }),
  ]);
}

export type InvoiceInput = { label: string; amount: string; fileUrl?: string; status?: string };

export function addInvoice(bookingId: string, data: InvoiceInput) {
  return prisma.invoice.create({ data: { ...data, bookingId } });
}

export function updateInvoiceStatus(id: string, status: string) {
  return prisma.invoice.update({ where: { id }, data: { status } });
}

export function deleteInvoice(id: string) {
  return prisma.invoice.delete({ where: { id } });
}
