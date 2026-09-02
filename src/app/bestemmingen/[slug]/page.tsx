import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { TwoColInfo } from "@/components/TwoColInfo";
import { TripCard } from "@/components/TripCard";
import { getDestinationBySlug } from "@/lib/content/destinations";
import { getTripsByDestinationSlug } from "@/lib/content/trips";
import { toTripCardData } from "@/lib/tripCard";
import { stripHtml } from "@/lib/stripHtml";
import styles from "@/styles/detailPage.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};
  return { title: `${destination.name} — AdventureTravels`, description: stripHtml(destination.heroSubtitle) };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const trips = await getTripsByDestinationSlug(slug);
  const sportNames = Array.from(new Set(trips.map((trip) => trip.sport.name)));

  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="bestemmingen"
        height={620}
        image={destination.heroImage}
        imageAlt={destination.name}
        eyebrow={destination.name}
        title={destination.heroTitle}
        subtitle={destination.heroSubtitle}
        meta={[`Vliegtijd ${destination.flightTime}`, destination.bestPeriod, sportNames.join(", ")]}
      />

      <TwoColInfo
        items={[
          {
            title: "Praktisch",
            text: `Vliegtijd circa ${destination.flightTime}. Beste periode: ${destination.bestPeriod}.${
              sportNames.length ? ` Sport hier aangeboden: ${sportNames.join(", ").toLowerCase()}.` : ""
            }`,
          },
        ]}
      />

      {trips.length > 0 && (
        <div className={styles.section} style={{ paddingTop: 0 }}>
          <h2 className={styles.sectionTitle}>Reizen naar {destination.name}</h2>
          <div className={styles.tripGrid3}>
            {trips.map((trip) => (
              <TripCard key={trip.slug} trip={toTripCardData(trip)} />
            ))}
          </div>
        </div>
      )}

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
