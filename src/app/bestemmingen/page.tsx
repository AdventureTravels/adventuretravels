import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { CategoryCard } from "@/components/CategoryCard";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import { PinIcon } from "@/components/icons";
import { getDestinations } from "@/lib/content/destinations";
import { getTripsByDestinationSlug } from "@/lib/content/trips";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Bestemmingen — AdventureTravels",
  description: "We beginnen bij de Turkse kust.",
};

export default async function BestemmingenPage() {
  const destinations = await getDestinations();
  const tripCounts = await Promise.all(
    destinations.map((destination) => getTripsByDestinationSlug(destination.slug))
  );

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="bestemmingen" />

      <div className={styles.intro}>
        <span className={styles.eyebrow}>Waar we naartoe gaan</span>
        <h1 className={styles.heading}>We beginnen bij de Turkse kust.</h1>
        <p className={styles.subheading}>
          Bij lancering één bestemming, gekozen om dezelfde reden als altijd: een goed cable park
          overdag, een verblijf waar je &apos;s avonds graag bent.
        </p>
      </div>

      <div className={styles.grid}>
        {destinations.map((destination, i) => {
          const trips = tripCounts[i];
          const sportNames = Array.from(new Set(trips.map((trip) => trip.sport.name))).join(", ");
          return (
            <CategoryCard
              key={destination.id}
              href={`/bestemmingen/${destination.slug}`}
              image={destination.cardImage}
              icon={<PinIcon size={22} color="#FFFFFF" strokeWidth={2.6} />}
              name={destination.name}
              nameSize={26}
              height={380}
              subLabel={`${trips.length} reis · ${sportNames.toLowerCase()}`}
              caption={`${destination.caption} · ${destination.bestPeriod}`}
              ctaLabel="Bekijk bestemming"
            />
          );
        })}
        <ComingSoonTile text="Meer bestemmingen volgen" height={380} />
      </div>
      <div className={styles.spacer} />

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
