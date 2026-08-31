"use client";

import type { ReactNode } from "react";
import { Placeholder } from "./Placeholder";
import { ComingSoonTile } from "./ComingSoonTile";
import { RichText } from "./RichText";
import { SliderControls } from "./SliderControls";
import { useSlider } from "./useSlider";
import { ArrowIcon } from "./icons";
import styles from "./FeaturedTrips.module.css";

export type FeaturedTrip = {
  href: string;
  image: string;
  level: string;
  icon: ReactNode;
  category: string;
  title: string;
  text: string;
  duration: string;
  date: string;
  price: string;
  priceNote: string;
};

const SLOT_COUNT = 4;

export function FeaturedTrips({ trips }: { trips: FeaturedTrip[] }) {
  const { ref, progress, onScroll, prev, next } = useSlider();
  const emptySlots = Math.max(0, SLOT_COUNT - trips.length);

  return (
    <div id="reizen" className={styles.section}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.eyebrow}>Uitgelicht</span>
          <h2 className={styles.title}>Reizen die nu open staan</h2>
        </div>
        <div className={styles.headRight}>
          <a href="/reizen" className={styles.viewAll}>
            Alle reizen
          </a>
          <SliderControls onPrev={prev} onNext={next} />
        </div>
      </div>

      <div ref={ref} onScroll={onScroll} className={styles.track}>
        {trips.map((trip) => (
          <a key={trip.title} href={trip.href} className={styles.card}>
            <div className={styles.cardImage}>
              <Placeholder label={trip.image} />
              <span className={styles.levelBadge}>{trip.level}</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.category}>
                {trip.icon}
                <span className={styles.categoryLabel}>{trip.category}</span>
              </div>
              <div className={styles.cardTitle}>{trip.title}</div>
              <RichText html={trip.text} className={styles.cardText} />
              <div className={styles.metaRow}>
                <span>{trip.duration}</span>
                <span className={styles.metaDate}>{trip.date}</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.price}>
                  {trip.price} <span className={styles.priceNote}>{trip.priceNote}</span>
                </span>
                <span className={styles.cta}>
                  Bekijk reis
                  <ArrowIcon size={13} />
                </span>
              </div>
            </div>
          </a>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={i} className={styles.card}>
            <ComingSoonTile text="Meer reizen volgen" height={468} />
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressThumb}
            style={{ width: `${progress.width}%`, left: `${progress.left}%` }}
          />
        </div>
        <span className={styles.count}>{trips.length} uitgelichte {trips.length === 1 ? "reis" : "reizen"}</span>
        <a href="tel:+31202441860" className={styles.speakToGuide}>
          Spreek een gids
        </a>
      </div>
    </div>
  );
}
