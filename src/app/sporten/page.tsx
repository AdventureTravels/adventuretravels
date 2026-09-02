import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { CategoryCard } from "@/components/CategoryCard";
import { getSports } from "@/lib/content/sports";
import { tripSportIcon } from "@/lib/tripCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sporten — AdventureTravels",
  description: "Wakeboarden. De rest volgt.",
};

export default async function SportenPage() {
  const sports = await getSports();

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
        {sports.map((sport) => (
          <CategoryCard
            key={sport.id}
            href={`/sporten/${sport.slug}`}
            image={sport.cardImage}
            imageAlt={sport.name}
            icon={tripSportIcon(sport.slug, { size: 24, color: "#FFFFFF" })}
            name={sport.name}
            nameSize={20}
            caption={sport.caption}
            ctaLabel="Bekijk sport"
          />
        ))}
      </div>
      <div className={styles.spacer} />

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
