import Link from "next/link";
import type { ReactNode } from "react";
import { SiteImage } from "./SiteImage";
import { RichText } from "./RichText";
import { ArrowIcon } from "./icons";
import styles from "./TripCard.module.css";

export type Trip = {
  slug: string;
  image: string;
  imageAlt: string;
  level: string;
  icon: ReactNode;
  /** Sport en land, bv. "Wakeboarden · Turkije" */
  label: string;
  title: string;
  text: string;
  duration: string;
  date: string;
  price: string;
  priceNote: string;
};

export function TripCard({
  trip,
  className,
  ctaLabel = "Bekijk reis",
}: {
  trip: Trip;
  className?: string;
  ctaLabel?: string;
}) {
  const meta = [trip.duration, trip.date].filter(Boolean);

  return (
    <Link href={`/reizen/${trip.slug}`} className={`${styles.card} ${className ?? ""}`}>
      <div className={styles.image}>
        <SiteImage src={trip.image} alt={trip.imageAlt} />
        {trip.level && <span className={styles.levelBadge}>{trip.level}</span>}
      </div>
      <div className={styles.body}>
        <div className={styles.category}>
          {trip.icon}
          <span className={styles.categoryLabel}>{trip.label}</span>
        </div>
        <div className={styles.title}>{trip.title}</div>
        {trip.text && <RichText html={trip.text} className={styles.text} />}
        {meta.length > 0 && (
          <div className={styles.metaRow}>
            {trip.duration && <span>{trip.duration}</span>}
            {trip.date && <span className={styles.metaDate}>{trip.date}</span>}
          </div>
        )}
        <div className={styles.priceRow}>
          {trip.price ? (
            <span className={styles.price}>
              {trip.price} {trip.priceNote && <span className={styles.priceNote}>{trip.priceNote}</span>}
            </span>
          ) : (
            <span />
          )}
          <span className={styles.cta}>
            {ctaLabel}
            <ArrowIcon size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
