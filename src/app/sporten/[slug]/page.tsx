import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { TwoColInfo } from "@/components/TwoColInfo";
import { TripCard } from "@/components/TripCard";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import { SportNewsletterForm } from "@/components/SportNewsletterForm";
import { ArrowIcon } from "@/components/icons";
import { getSportBySlug } from "@/lib/content/sports";
import { getTripsBySportSlug } from "@/lib/content/trips";
import { toTripCardData } from "@/lib/tripCard";
import { stripHtml } from "@/lib/stripHtml";
import styles from "@/styles/detailPage.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);
  if (!sport) return {};
  return { title: `${sport.name} — AdventureTravels`, description: stripHtml(sport.heroSubtitle) };
}

export default async function SportDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);
  if (!sport) notFound();

  const trips = await getTripsBySportSlug(slug);

  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="sporten"
        height={620}
        imageLabel={sport.heroImage}
        eyebrow={sport.name}
        title={sport.heroTitle}
        subtitle={sport.heroSubtitle}
      />

      <TwoColInfo
        items={[
          {
            title: "Voor wie",
            text: "Van complete beginners tot riders die aan hun eerste kickers toe zijn. Geen ervaring nodig, wel motivatie.",
          },
          {
            title: "Wat je kunt verwachten",
            text: "Kleine groepen op de kabel, materiaal inbegrepen, en genoeg tijd op het water om echt vooruit te komen.",
          },
        ]}
      />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Reizen met {sport.name.toLowerCase()}</h2>
        <div className={styles.tripGrid}>
          {trips.map((trip) => (
            <TripCard key={trip.slug} trip={toTripCardData(trip)} />
          ))}
          <ComingSoonTile text="Meer reizen volgen" height={320} />
        </div>
        <div className={styles.ctaRow}>
          <a href="/reizen" className={styles.primaryCta}>
            Bekijk {sport.name.toLowerCase()}reizen
            <ArrowIcon size={15} />
          </a>
        </div>
      </div>

      <div className={styles.section}>
        <SportNewsletterForm sportSlug={sport.slug} sportName={sport.name} />
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
