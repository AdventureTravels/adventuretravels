import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export function getTrips() {
  return prisma.trip.findMany({
    orderBy: { order: "asc" },
    include: { sport: true, destination: true },
  });
}

export function getTripBySlug(slug: string) {
  return prisma.trip.findUnique({
    where: { slug },
    include: { sport: true, destination: true },
  });
}

export function getTripById(id: string) {
  return prisma.trip.findUnique({
    where: { id },
    include: { sport: true, destination: true },
  });
}

export function getTripsBySportSlug(sportSlug: string) {
  return prisma.trip.findMany({
    where: { sport: { slug: sportSlug } },
    orderBy: { order: "asc" },
    include: { sport: true, destination: true },
  });
}

export function getTripsByDestinationSlug(destinationSlug: string) {
  return prisma.trip.findMany({
    where: { destination: { slug: destinationSlug } },
    orderBy: { order: "asc" },
    include: { sport: true, destination: true },
  });
}

export type TripProgramStep = { day: string; text: string };

export type TripInput = {
  slug: string;
  title: string;
  image: string;
  level: string;
  category: string;
  text: string;
  duration: string;
  date: string;
  price: string;
  priceNote: string;
  heroImage: string;
  heroSubtitle: string;
  program: TripProgramStep[];
  included: string;
  notIncluded: string;
  stayTitle: string;
  stayBody: string;
  stayImage: string;
  galleryImages: string[];
  fixedDepartureDate?: string | null;
  order: number;
  sportId: string;
  destinationId: string;
};

function toPrismaData(data: TripInput) {
  return {
    ...data,
    program: data.program as unknown as Prisma.InputJsonValue,
    galleryImages: data.galleryImages as unknown as Prisma.InputJsonValue,
  };
}

export function createTrip(data: TripInput) {
  return prisma.trip.create({ data: toPrismaData(data) });
}

export function updateTrip(id: string, data: TripInput) {
  return prisma.trip.update({ where: { id }, data: toPrismaData(data) });
}

export function deleteTrip(id: string) {
  return prisma.trip.delete({ where: { id } });
}
