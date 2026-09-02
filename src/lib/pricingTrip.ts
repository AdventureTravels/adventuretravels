import type { PublicTrip } from "@/lib/content/trips";
import type { DepartureAvailability } from "@/lib/content/departures";
import { toCents, type PricingTrip } from "@/lib/pricing";

/** Serialiseerbare prijsconfiguratie van een reis voor client components. */
export function pricingTripFrom(trip: PublicTrip, departures: DepartureAvailability[]): PricingTrip {
  return {
    slug: trip.slug,
    title: trip.title,
    type: trip.type === "group" ? "group" : "individual",
    pricePpBaseCents: toCents(trip.pricePpBase),
    pricePerExtraNightCents: toCents(trip.pricePerExtraNight),
    minNights: trip.minNights,
    maxNights: trip.maxNights,
    seasonStartMonth: trip.seasonStartMonth,
    seasonEndMonth: trip.seasonEndMonth,
    extras: trip.extras.map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description,
      pricePpCents: toCents(e.pricePp) ?? 0,
      isPerNight: e.isPerNight,
    })),
    departures: departures.map((d) => ({
      id: d.id,
      departureDate: d.departureDate.toISOString(),
      returnDate: d.returnDate.toISOString(),
      pricePpCents: toCents(d.pricePpAllIn) ?? 0,
      seatsLeft: d.seatsLeft,
      minParticipants: d.minParticipants,
      bookingDeadline: d.bookingDeadline.toISOString(),
    })),
  };
}
