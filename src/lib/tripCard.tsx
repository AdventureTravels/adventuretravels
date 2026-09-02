import type { ReactNode } from "react";
import type { Trip, Sport, Destination } from "@prisma/client";
import { WaveIcon, MountainBikeIcon } from "@/components/icons";
import type { Trip as TripCardData } from "@/components/TripCard";

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

export function toTripCardData(trip: Trip & { sport: Sport; destination: Destination }): TripCardData {
  return {
    slug: trip.slug,
    image: trip.image,
    imageAlt: trip.title,
    level: trip.level,
    icon: tripSportIcon(trip.sport.slug),
    label: `${trip.sport.name} · ${trip.destination.name}`,
    title: trip.title,
    text: trip.text,
    duration: trip.duration,
    date: trip.date,
    price: trip.price,
    priceNote: trip.priceNote,
  };
}
