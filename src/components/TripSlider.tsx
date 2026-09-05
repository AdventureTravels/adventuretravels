"use client";

import { TripCard, type Trip as TripCardData } from "./TripCard";
import { Slider } from "./Slider";
import styles from "./TripSlider.module.css";

/** Slider van TripCards (homepage-hero). Eén reis: alleen de kaart. */
export function TripSlider({ trips, tone = "light" }: { trips: TripCardData[]; tone?: "light" | "dark" }) {
  return (
    <Slider
      ariaLabel="Reizen"
      tone={tone}
      items={trips.map((trip) => ({ key: trip.slug, label: trip.title, node: <TripCard trip={trip} className={styles.card} /> }))}
    />
  );
}
