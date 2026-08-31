import Link from "next/link";
import type { ReactNode } from "react";
import { Placeholder } from "./Placeholder";
import { RichText } from "./RichText";
import { ArrowIcon } from "./icons";
import styles from "./TripCard.module.css";

export type Trip = {
  slug: string;
  image: string;
  level: string;
  icon: ReactNode;
  category: string;
  title: string;
  text: string;
  duration: string;
  date: string;
  price: string;
  priceNote?: string;
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
  return (
    <Link href={`/reizen/${trip.slug}`} className={`${styles.card} ${className ?? ""}`}>
      <div className={styles.image}>
        <Placeholder label={trip.image} />
        <span className={styles.levelBadge}>{trip.level}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.category}>
          {trip.icon}
          <span className={styles.categoryLabel}>{trip.category}</span>
        </div>
        <div className={styles.title}>{trip.title}</div>
        <RichText html={trip.text} className={styles.text} />
        <div className={styles.metaRow}>
          <span>{trip.duration}</span>
          <span className={styles.metaDate}>{trip.date}</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>
            {trip.price}{" "}
            <span className={styles.priceNote}>{trip.priceNote ?? "p.p. incl. verblijf, gids & diners"}</span>
          </span>
          <span className={styles.cta}>
            {ctaLabel}
            <ArrowIcon size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
