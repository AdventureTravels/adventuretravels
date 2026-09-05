"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { SliderControls } from "./SliderControls";
import styles from "./TripSlider.module.css";

export type SliderItem = { key: string; label: string; node: ReactNode };

/**
 * Generieke horizontale slider: pijlen en dots op desktop, native swipe op
 * mobiel (scroll-snap). Bij één item: alleen het item, geen pijlen of dots.
 * TripSlider en de "inbegrepen"-slider bouwen hierop.
 */
export function Slider({
  items,
  ariaLabel,
  tone = "light",
  slideClassName,
}: {
  items: SliderItem[];
  ariaLabel: string;
  tone?: "light" | "dark";
  slideClassName?: string;
}) {
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
      const clamped = Math.max(0, Math.min(items.length - 1, index));
      track.scrollTo({ left: cardOffset(clamped), behavior: "smooth" });
      setActive(clamped);
    },
    [cardOffset, items.length]
  );

  useEffect(() => {
    measure();
  }, [measure, items.length]);

  if (items.length === 0) return null;
  const multiple = items.length > 1;

  return (
    <div className={`${styles.slider} ${tone === "dark" ? styles.dark : ""}`}>
      <div ref={trackRef} onScroll={measure} className={`${styles.track} ${multiple ? "" : styles.trackSingle}`} role="list" aria-label={ariaLabel}>
        {items.map((item) => (
          <div key={item.key} className={`${styles.slide} ${slideClassName ?? ""}`} role="listitem">
            {item.node}
          </div>
        ))}
      </div>

      {multiple && (
        <div className={styles.footer}>
          <div className={styles.dots} role="tablist" aria-label={`Ga naar ${ariaLabel.toLowerCase()}`}>
            {items.map((item, i) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={item.label}
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
