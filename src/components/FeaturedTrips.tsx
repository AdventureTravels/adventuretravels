import Link from "next/link";
import { TripSlider } from "./TripSlider";
import type { Trip as TripCardData } from "./TripCard";
import styles from "./FeaturedTrips.module.css";

/** "Uitgelicht"-sectie op de homepage: alleen wat er is, geen lege tegels en
 * geen tellingen. Rendert niets zonder reizen. */
export function FeaturedTrips({ trips }: { trips: TripCardData[] }) {
  if (trips.length === 0) return null;

  return (
    <div id="reizen" className={styles.section}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.eyebrow}>Uitgelicht</span>
          <h2 className={styles.title}>Reizen die nu open staan</h2>
        </div>
        <Link href="/reizen" className={styles.viewAll}>
          Alle reizen
        </Link>
      </div>
      <div className={styles.body}>
        <TripSlider trips={trips} />
      </div>
    </div>
  );
}
