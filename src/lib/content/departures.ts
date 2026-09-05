import type { TripDeparture } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ACTIVE_STATUSES } from "@/lib/content/bookings";
import { openDepartures } from "@/lib/publish";

/** Aantal geboekte plekken per vertrek (deelnemers van actieve boekingen). */
export async function getBookedSeats(tripId: string): Promise<Map<string, number>> {
  const bookings = await prisma.booking.findMany({
    where: { tripId, departureId: { not: null }, status: { in: [...ACTIVE_STATUSES] } },
    select: { departureId: true, _count: { select: { participants: true } } },
  });
  const map = new Map<string, number>();
  for (const b of bookings) {
    if (!b.departureId) continue;
    map.set(b.departureId, (map.get(b.departureId) ?? 0) + Math.max(1, b._count.participants));
  }
  return map;
}

export type DepartureAvailability = TripDeparture & { booked: number; seatsLeft: number };

/** Open vertrekken met beschikbaarheid, in datumvolgorde. Volle vertrekken blijven zichtbaar met seatsLeft 0. */
export async function getOpenDeparturesWithAvailability(tripId: string, departures: TripDeparture[]): Promise<DepartureAvailability[]> {
  const booked = await getBookedSeats(tripId);
  return openDepartures(departures).map((d) => {
    const b = booked.get(d.id) ?? 0;
    return { ...d, booked: b, seatsLeft: Math.max(0, d.maxParticipants - b) };
  });
}

// ---------------------------------------------------------------------------
// Admin: vertrekken en extra's per reis
// ---------------------------------------------------------------------------

export type DepartureInput = {
  departureDate: Date;
  returnDate: Date;
  pricePpAllIn: string;
  maxParticipants: number;
  minParticipants: number;
  bookingDeadline: Date;
  guideId: string | null;
  status: string;
};

export function createDeparture(tripId: string, data: DepartureInput) {
  return prisma.tripDeparture.create({ data: { ...data, tripId } });
}

export function updateDeparture(id: string, data: DepartureInput) {
  return prisma.tripDeparture.update({ where: { id }, data });
}

export function deleteDeparture(id: string) {
  return prisma.tripDeparture.delete({ where: { id } });
}

export type ExtraInput = { name: string; description: string | null; pricePp: string; isPerNight: boolean; order: number };

export function createExtra(tripId: string, data: ExtraInput) {
  return prisma.tripExtra.create({ data: { ...data, tripId } });
}

export function updateExtra(id: string, data: ExtraInput) {
  return prisma.tripExtra.update({ where: { id }, data });
}

export function deleteExtra(id: string) {
  return prisma.tripExtra.delete({ where: { id } });
}
