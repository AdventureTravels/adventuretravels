import { prisma } from "@/lib/db";

export function getDestinations() {
  return prisma.destination.findMany({ orderBy: { order: "asc" } });
}

export function getDestinationBySlug(slug: string) {
  return prisma.destination.findUnique({ where: { slug } });
}

export function getDestinationById(id: string) {
  return prisma.destination.findUnique({ where: { id } });
}

export type DestinationInput = {
  slug: string;
  name: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  cardImage: string;
  caption: string;
  flightTime: string;
  bestPeriod: string;
  order: number;
};

export function createDestination(data: DestinationInput) {
  return prisma.destination.create({ data });
}

export function updateDestination(id: string, data: DestinationInput) {
  return prisma.destination.update({ where: { id }, data });
}

export function deleteDestination(id: string) {
  return prisma.destination.delete({ where: { id } });
}
