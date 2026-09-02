"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TripCard, type Trip as TripCardData } from "./TripCard";
import { SliderControls } from "./SliderControls";
import styles from "./TripSlider.module.css";

/**
 * Horizontale slider van TripCards: pijlen en dots op desktop, native swipe op
 * mobiel (scroll-snap). Bij één reis: alleen de kaart, geen pijlen of dots.
 */
export function TripSlider({ trips, tone = "light" }: { trips: TripCardData[]; tone?: "light" | "dark" }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const cardOffset = useCallback((index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return 0;
    return card.offsetLeft - track.offsetLeft;
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    let best = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((child, i) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - track.offsetLeft - track.scrollLeft);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    setActive(best);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(trips.length - 1, index));
      track.scrollTo({ left: cardOffset(clamped), behavior: "smooth" });
      setActive(clamped);
    },
    [cardOffset, trips.length]
  );

  useEffect(() => {
    measure();
  }, [measure, trips.length]);

  if (trips.length === 0) return null;
  const multiple = trips.length > 1;

  return (
    <div className={`${styles.slider} ${tone === "dark" ? styles.dark : ""}`}>
      <div
        ref={trackRef}
        onScroll={measure}
        className={`${styles.track} ${multiple ? "" : styles.trackSingle}`}
        role="list"
        aria-label="Reizen"
      >
        {trips.map((trip) => (
          <div key={trip.slug} className={styles.slide} role="listitem">
            <TripCard trip={trip} className={styles.card} />
          </div>
        ))}
      </div>

      {multiple && (
        <div className={styles.footer}>
          <div className={styles.dots} role="tablist" aria-label="Ga naar reis">
            {trips.map((trip, i) => (
              <button
                key={trip.slug}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={trip.title}
                className={i === active ? `${styles.dot} ${styles.dotActive}` : styles.dot}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <SliderControls onPrev={() => goTo(active - 1)} onNext={() => goTo(active + 1)} />
        </div>
      )}
    </div>
  );
}
