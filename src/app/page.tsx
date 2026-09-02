import { Topbar } from "@/components/Topbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { FeaturedTrips } from "@/components/FeaturedTrips";
import { DayNight } from "@/components/DayNight";
import { Included } from "@/components/Included";
import { TripTypes, type TripTypeTile } from "@/components/TripTypes";
import { ProgramCta } from "@/components/ProgramCta";
import { Reviews } from "@/components/Reviews";
import { Journal, type JournalTeaser } from "@/components/Journal";
import { Footer } from "@/components/Footer";
import { getTrips } from "@/lib/content/trips";
import { getArticles } from "@/lib/content/articles";
import { getTripTypes } from "@/lib/content/tripTypes";
import { toTripCardData } from "@/lib/tripCard";
import { renderIcon } from "@/lib/iconLookup";
import styles from "./page.module.css";

export default async function Home() {
  const [trips, articles, tripTypes] = await Promise.all([getTrips(), getArticles(), getTripTypes()]);

  const tripTypeTiles: TripTypeTile[] = tripTypes.map((type) => ({
    href: type.href,
    icon: renderIcon(type.icon, { size: 40, strokeWidth: 1.6 }),
    title: type.title,
    meta: type.meta,
  }));

  const tripCards = trips.map(toTripCardData);

  const journalTeasers: JournalTeaser[] = articles.slice(0, 4).map((article) => ({
    href: `/journal/${article.slug}`,
    tag: article.tag,
    title: article.title,
    text: article.excerpt,
  }));

  return (
    <div className={styles.page}>
      <Topbar />
      <Hero trips={tripCards} />
      <TrustStrip />
      <FeaturedTrips trips={tripCards} />
      <DayNight />
      <Included />
      <TripTypes types={tripTypeTiles} />
      <ProgramCta />
      <Reviews />
      <Journal articles={journalTeasers} />
      <Footer />
    </div>
  );
}
