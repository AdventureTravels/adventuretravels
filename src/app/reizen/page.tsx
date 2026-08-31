import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { getTrips } from "@/lib/content/trips";
import { toTripCardData } from "@/lib/tripCard";
import { ReizenFilters } from "./ReizenFilters";
import styles from "./page.module.css";

export default async function ReizenPage() {
  const trips = await getTrips();
  const sportSlugs = Array.from(new Set(trips.map((trip) => trip.sport.slug)));
  const destinationSlugs = Array.from(new Set(trips.map((trip) => trip.destination.slug)));

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="reizen" />

      <ReizenFilters
        trips={trips.map(toTripCardData)}
        sportSlugs={sportSlugs}
        destinationSlugs={destinationSlugs}
      />

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
