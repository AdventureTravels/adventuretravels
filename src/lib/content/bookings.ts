import { prisma } from "@/lib/db";
import { randomBytes } from "node:crypto";

export function getBookingRequests() {
  return prisma.bookingRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { trip: true },
  });
}

export function getBookingRequestById(id: string) {
  return prisma.bookingRequest.findUnique({
    where: { id },
    include: { trip: true, participants: { orderBy: { order: "asc" } }, invoices: { orderBy: { issuedAt: "asc" } } },
  });
}

export function getBookingsByEmail(email: string) {
  return prisma.bookingRequest.findMany({
    where: { email: { equals: email, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    include: { trip: true },
  });
}

export type BookingRequestInput = {
  tripId: string;
  name: string;
  email: string;
  phone?: string;
  preferredDate: string;
  message?: string;
};

async function generateBookingNumber() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
    const bookingNumber = `AT-${code}`;
    const existing = await prisma.bookingRequest.findUnique({ where: { bookingNumber } });
    if (!existing) return bookingNumber;
  }
  throw new Error("Kon geen uniek boekingsnummer genereren.");
}

export async function createBookingRequest(data: BookingRequestInput) {
  const bookingNumber = await generateBookingNumber();
  return prisma.bookingRequest.create({ data: { ...data, bookingNumber } });
}

export function updateBookingRequestStatus(id: string, status: string) {
  return prisma.bookingRequest.update({ where: { id }, data: { status } });
}

export type BookingPaymentInput = {
  totalAmount?: string;
  depositAmount?: string;
  depositPaid?: boolean;
  balanceAmount?: string;
  balancePaid?: boolean;
  notes?: string;
};

export function updateBookingPayment(id: string, data: BookingPaymentInput) {
  const patch: BookingPaymentInput & { depositPaidAt?: Date | null; balancePaidAt?: Date | null } = { ...data };
  if (data.depositPaid !== undefined) {
    patch.depositPaidAt = data.depositPaid ? new Date() : null;
  }
  if (data.balancePaid !== undefined) {
    patch.balancePaidAt = data.balancePaid ? new Date() : null;
  }
  return prisma.bookingRequest.update({ where: { id }, data: patch });
}

export function deleteBookingRequest(id: string) {
  return prisma.bookingRequest.delete({ where: { id } });
}

export type ParticipantInput = { name: string; birthdate?: string; dietaryNotes?: string };

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
