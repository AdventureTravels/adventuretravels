import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { TripCard } from "@/components/TripCard";
import { getTrips } from "@/lib/content/trips";
import { toTripCardData } from "@/lib/tripCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Reizen — AdventureTravels",
  description: "Alle reizen van AdventureTravels, door onszelf getest.",
};

/** Alle gepubliceerde reizen als grid, in dezelfde volgorde als de slider op de homepage. */
export default async function ReizenPage() {
  const trips = await getTrips();

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="reizen" />

      <div className={styles.intro}>
        <span className={styles.eyebrow}>Alle reizen</span>
        <h1 className={styles.heading}>Kies je sport. De rest hebben we al voor je uitgezocht.</h1>
        <p className={styles.subheading}>Elke reis in dit overzicht is door onszelf getest.</p>
      </div>

      <div className={styles.results}>
        {trips.length > 0 ? (
          <div className={styles.grid}>
            {trips.map((trip) => (
              <TripCard key={trip.slug} trip={toTripCardData(trip)} />
            ))}
          </div>
        ) : (
          <p className={styles.subheading}>Er staan op dit moment geen reizen open.</p>
        )}
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
