import type { Partner, Trip, TripDeparture } from "@prisma/client";
import { isCancellationPolicyValid } from "./cancellation";
import { isImageUrl } from "@/components/SiteImage";

export type PublishableTripInput = Trip & { partner: Partner; departures: TripDeparture[] };

export function openDepartures(departures: TripDeparture[], now = new Date()): TripDeparture[] {
  return departures.filter((d) => d.status === "open" && d.bookingDeadline > now && d.departureDate > now);
}

/**
 * Een reis wordt alleen getoond als hij compleet is. Alle publieke queries
 * filteren hierop; de admin toont de reden waarom een reis (nog) niet
 * publiceerbaar is via publishProblems().
 */
export function publishProblems(trip: PublishableTripInput): string[] {
  const problems: string[] = [];
  if (trip.status !== "published") problems.push(`Status is "${trip.status}", niet "published".`);
  if (!trip.partner.isActive) problems.push("Partner staat op inactief.");
  if (!isCancellationPolicyValid(trip.partner.cancellationPolicy)) problems.push("Partner heeft geen geldige annuleringsstaffel.");
  if (trip.type === "group") {
    if (openDepartures(trip.departures).length === 0) problems.push("Geen open vertrek met een boekingsdeadline in de toekomst.");
  } else if (trip.pricePpBase === null) {
    problems.push("Geen prijs per persoon (pricePpBase).");
  } else if (trip.minNights < 1 || trip.maxNights < trip.minNights) {
    problems.push("Aantal nachten klopt niet (min ≥ 1, max ≥ min).");
  }
  if (trip.includes.length === 0) problems.push("Geen 'inbegrepen'-regels.");
  if (trip.excludes.length === 0) problems.push("Geen 'niet inbegrepen'-regels.");
  if (!isImageUrl(trip.heroImage)) problems.push("Geen echte hero-foto geüpload.");
  if (!isImageUrl(trip.image)) problems.push("Geen echte kaart-foto geüpload.");
  return problems;
}

export function isTripPublishable(trip: PublishableTripInput): boolean {
  return publishProblems(trip).length === 0;
}
