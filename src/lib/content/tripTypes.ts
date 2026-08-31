import { prisma } from "@/lib/db";

export function getTripTypes() {
  return prisma.tripType.findMany({ orderBy: { order: "asc" } });
}

export function getTripTypeById(id: string) {
  return prisma.tripType.findUnique({ where: { id } });
}

export type TripTypeInput = {
  href: string;
  icon: string;
  title: string;
  meta: string;
  order: number;
};

export function createTripType(data: TripTypeInput) {
  return prisma.tripType.create({ data });
}

export function updateTripType(id: string, data: TripTypeInput) {
  return prisma.tripType.update({ where: { id }, data });
}

export function deleteTripType(id: string) {
  return prisma.tripType.delete({ where: { id } });
}
