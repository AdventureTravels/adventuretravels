import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isTripPublishable, type PublishContext } from "@/lib/publish";
import { getSiteSettings } from "@/lib/content/settings";

/** Alles wat een publieke reiskaart of -pagina nodig heeft, inclusief wat de publicatiecheck leest. */
export const PUBLIC_TRIP_INCLUDE = {
  sport: true,
  destination: true,
  partner: true,
  guide: true,
  departures: { orderBy: { departureDate: "asc" as const } },
  extras: { orderBy: { order: "asc" as const } },
} satisfies Prisma.TripInclude;

export type PublicTrip = Prisma.TripGetPayload<{ include: typeof PUBLIC_TRIP_INCLUDE }>;

// ---------------------------------------------------------------------------
// Publiek: alleen publiceerbare reizen
// ---------------------------------------------------------------------------

export async function publishContext(): Promise<PublishContext> {
  const settings = await getSiteSettings();
  return { infoFormPdfUrl: settings.infoFormPdfUrl };
}

async function publishedWhere(where: Prisma.TripWhereInput = {}): Promise<PublicTrip[]> {
  const [trips, ctx] = await Promise.all([
    prisma.trip.findMany({
      where: { ...where, status: "published" },
      orderBy: { order: "asc" },
      include: PUBLIC_TRIP_INCLUDE,
    }),
    publishContext(),
  ]);
  return trips.filter((t) => isTripPublishable(t, ctx));
}

export function getTrips() {
  return publishedWhere();
}

export async function getTripBySlug(slug: string): Promise<PublicTrip | null> {
  const [trip, ctx] = await Promise.all([prisma.trip.findUnique({ where: { slug }, include: PUBLIC_TRIP_INCLUDE }), publishContext()]);
  if (!trip || !isTripPublishable(trip, ctx)) return null;
  return trip;
}

export function getTripsBySportSlug(sportSlug: string) {
  return publishedWhere({ sport: { slug: sportSlug } });
}

export function getTripsByDestinationSlug(destinationSlug: string) {
  return publishedWhere({ destination: { slug: destinationSlug } });
}

// ---------------------------------------------------------------------------
// Admin: alle reizen, ongeacht status
// ---------------------------------------------------------------------------

export function getAllTrips() {
  return prisma.trip.findMany({ orderBy: { order: "asc" }, include: PUBLIC_TRIP_INCLUDE });
}

export function getTripById(id: string) {
  return prisma.trip.findUnique({ where: { id }, include: PUBLIC_TRIP_INCLUDE });
}

export type TripProgramStep = { day: string; text: string };
export type GalleryImage = { src: string; alt: string };
/** Vrije sectie op de reispagina; "top" staat vóór het programma, "bottom" (standaard) erna. */
export type TripSection = { title: string; bodyHtml: string; placement?: "top" | "bottom" };
export type TripFaqItem = { question: string; answer: string };

export function tripSections(value: unknown): TripSection[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => ({
      title: String((row as TripSection)?.title ?? "").trim(),
      bodyHtml: String((row as TripSection)?.bodyHtml ?? "").trim(),
      placement: (row as TripSection)?.placement === "top" ? ("top" as const) : ("bottom" as const),
    }))
    .filter((row) => row.title && row.bodyHtml);
}

export function tripFaq(value: unknown): TripFaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => ({
      question: String((row as TripFaqItem)?.question ?? "").trim(),
      answer: String((row as TripFaqItem)?.answer ?? "").trim(),
    }))
    .filter((row) => row.question && row.answer);
}

export type TripInput = {
  slug: string;
  title: string;
  type: string;
  status: string;
  level: string;
  image: string;
  imageAlt: string;
  text: string;
  heroImage: string;
  heroImageAlt: string;
  heroSubtitle: string;
  program: TripProgramStep[];
  stayTitle: string;
  stayBody: string;
  stayImage: string;
  stayImageAlt: string;
  galleryImages: GalleryImage[];
  includes: string[];
  excludes: string[];
  order: number;
  introBody: string;
  sections: TripSection[];
  faq: TripFaqItem[];
  priceNote: string;
  ctaTitle: string;
  ctaBody: string;
  metaTitle: string;
  metaDescription: string;
  seasonStartMonth: number;
  seasonEndMonth: number;
  minNights: number;
  maxNights: number;
  minPersons: number;
  pricePpBase: string | null;
  pricePerExtraNight: string | null;
  sportId: string;
  destinationId: string;
  partnerId: string;
  guideId: string | null;
};

function toPrismaData(data: TripInput) {
  return {
    ...data,
    program: data.program as unknown as Prisma.InputJsonValue,
    galleryImages: data.galleryImages as unknown as Prisma.InputJsonValue,
    sections: data.sections as unknown as Prisma.InputJsonValue,
    faq: data.faq as unknown as Prisma.InputJsonValue,
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
