import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { CategoryCard } from "@/components/CategoryCard";
import { PinIcon } from "@/components/icons";
import { getDestinations } from "@/lib/content/destinations";
import { getTripsByDestinationSlug } from "@/lib/content/trips";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Bestemmingen — AdventureTravels",
  description: "Elke bestemming staat er om dezelfde reden: een goed park overdag, een verblijf waar je 's avonds graag bent.",
};

export default async function BestemmingenPage() {
  const destinations = await getDestinations();
  const tripsPerDestination = await Promise.all(
    destinations.map((destination) => getTripsByDestinationSlug(destination.slug))
  );

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="bestemmingen" />

      <div className={styles.intro}>
        <span className={styles.eyebrow}>Waar we naartoe gaan</span>
        <h1 className={styles.heading}>Eén park per bestemming, zelf uitgezocht.</h1>
        <p className={styles.subheading}>
          Elke bestemming staat er om dezelfde reden: een goed park overdag, een verblijf waar je
          &apos;s avonds graag bent. Staat er nog geen reis bij een bestemming, dan zijn we er nog
          mee bezig.
        </p>
      </div>

      <div className={styles.grid}>
        {destinations.map((destination, i) => {
          const sportNames = Array.from(new Set(tripsPerDestination[i].map((trip) => trip.sport.name))).join(", ");
          return (
            <CategoryCard
              key={destination.id}
              href={`/bestemmingen/${destination.slug}`}
              image={destination.cardImage}
              imageAlt={destination.name}
              icon={<PinIcon size={22} color="#FFFFFF" strokeWidth={2.6} />}
              name={destination.name}
              nameSize={26}
              height={380}
              subLabel={sportNames || undefined}
              caption={[destination.caption, destination.bestPeriod].filter(Boolean).join(" · ")}
              ctaLabel="Bekijk bestemming"
            />
          );
        })}
      </div>
      <div className={styles.spacer} />

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
