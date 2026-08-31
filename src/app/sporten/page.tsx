import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { CategoryCard } from "@/components/CategoryCard";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import { getSports } from "@/lib/content/sports";
import { getTripsBySportSlug } from "@/lib/content/trips";
import { tripSportIcon } from "@/lib/tripCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sporten — AdventureTravels",
  description: "Wakeboarden. De rest volgt.",
};

const GRID_SIZE = 4;

export default async function SportenPage() {
  const sports = await getSports();
  const tripCounts = await Promise.all(
    sports.map((sport) => getTripsBySportSlug(sport.slug).then((trips) => trips.length))
  );

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="sporten" />

      <div className={styles.intro}>
        <span className={styles.eyebrow}>Onze sporten</span>
        <h1 className={styles.heading}>Wakeboarden. De rest volgt.</h1>
        <p className={styles.subheading}>
          We beginnen met de sport die AdventureTravels heeft laten ontstaan. Andere sporten
          worden na lancering toegevoegd.
        </p>
      </div>

      <div className={styles.grid}>
        {sports.map((sport, i) => (
          <CategoryCard
            key={sport.id}
            href={`/sporten/${sport.slug}`}
            image={sport.cardImage}
            icon={tripSportIcon(sport.slug, { size: 24, color: "#FFFFFF" })}
            name={sport.name}
            nameSize={20}
            caption={`${sport.caption} · ${tripCounts[i]} reis`}
            ctaLabel="Bekijk sport"
          />
        ))}
        {Array.from({ length: Math.max(0, GRID_SIZE - sports.length) }).map((_, i) => (
          <ComingSoonTile key={i} text="Volgt later" variant="label" />
        ))}
      </div>
      <div className={styles.spacer} />

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
