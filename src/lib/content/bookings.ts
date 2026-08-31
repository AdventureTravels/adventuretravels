import { prisma } from "@/lib/db";

export function getBookingRequests() {
  return prisma.bookingRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { trip: true },
  });
}

export function getBookingRequestById(id: string) {
  return prisma.bookingRequest.findUnique({ where: { id }, include: { trip: true } });
}

export type BookingRequestInput = {
  tripId: string;
  name: string;
  email: string;
  phone?: string;
  preferredDate: string;
  message?: string;
};

export function createBookingRequest(data: BookingRequestInput) {
  return prisma.bookingRequest.create({ data });
}

export function updateBookingRequestStatus(id: string, status: string) {
  return prisma.bookingRequest.update({ where: { id }, data: { status } });
}

export function deleteBookingRequest(id: string) {
  return prisma.bookingRequest.delete({ where: { id } });
}
