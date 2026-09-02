import type { ReactNode } from "react";
import { WaveIcon, MountainBikeIcon } from "@/components/icons";
import type { Trip as TripCardData } from "@/components/TripCard";
import type { PublicTrip } from "@/lib/content/trips";
import { formatNights, formatPrice, formatSeason } from "@/lib/format";
import { levelLabel } from "@/lib/levels";
import { openDepartures } from "@/lib/publish";

const SPORT_ICONS: Record<string, (props: { size?: number; color?: string; strokeWidth?: number }) => ReactNode> = {
  wakeboarden: WaveIcon,
  mountainbike: MountainBikeIcon,
};

export function tripSportIcon(
  sportSlug: string,
  { size = 17, color = "#23261F", strokeWidth = 2.6 }: { size?: number; color?: string; strokeWidth?: number } = {}
): ReactNode {
  const Icon = SPORT_ICONS[sportSlug] ?? WaveIcon;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}

/** Laagste prijs p.p. voor een kaart: individueel bij minNights, groep het goedkoopste open vertrek. */
export function tripFromPrice(trip: PublicTrip): { amount: string; from: boolean } | null {
  if (trip.type === "group") {
    const open = openDepartures(trip.departures);
    if (open.length === 0) return null;
    const lowest = open.reduce((min, d) => (d.pricePpAllIn.lessThan(min.pricePpAllIn) ? d : min));
    return { amount: formatPrice(lowest.pricePpAllIn), from: open.length > 1 };
  }
  if (trip.pricePpBase === null) return null;
  return { amount: formatPrice(trip.pricePpBase), from: trip.pricePerExtraNight !== null };
}

export function toTripCardData(trip: PublicTrip): TripCardData {
  const price = tripFromPrice(trip);
  const open = openDepartures(trip.departures);
  return {
    slug: trip.slug,
    image: trip.image,
    imageAlt: trip.imageAlt || trip.title,
    level: levelLabel(trip.level),
    icon: tripSportIcon(trip.sport.slug),
    label: `${trip.sport.name} · ${trip.destination.name}`,
    title: trip.title,
    text: trip.text,
    duration:
      trip.type === "group" && open.length > 0
        ? `${open.length} ${open.length === 1 ? "vertrek" : "vertrekken"}`
        : formatNights(trip.minNights, trip.maxNights),
    date: trip.type === "group" ? "Vlucht inbegrepen" : formatSeason(trip.seasonStartMonth, trip.seasonEndMonth),
    price: price ? `${price.from ? "vanaf " : ""}${price.amount}` : "",
    priceNote: price ? "p.p." : "",
  };
}
