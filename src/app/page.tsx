import { Topbar } from "@/components/Topbar";
import { Hero } from "@/components/Hero";
import { StickySearchStrip } from "@/components/StickySearchStrip";
import { TrustStrip } from "@/components/TrustStrip";
import { FeaturedTrips, type FeaturedTrip } from "@/components/FeaturedTrips";
import { DayNight } from "@/components/DayNight";
import { Included } from "@/components/Included";
import { TripTypes, type TripTypeTile } from "@/components/TripTypes";
import { ProgramCta } from "@/components/ProgramCta";
import { Reviews } from "@/components/Reviews";
import { Newsletter } from "@/components/Newsletter";
import { Journal, type JournalTeaser } from "@/components/Journal";
import { Footer } from "@/components/Footer";
import { getTrips } from "@/lib/content/trips";
import { getArticles } from "@/lib/content/articles";
import { getTripTypes } from "@/lib/content/tripTypes";
import { tripSportIcon } from "@/lib/tripCard";
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

  const featuredTrips: FeaturedTrip[] = trips.slice(0, 4).map((trip) => ({
    href: `/reizen/${trip.slug}`,
    image: trip.image,
    level: trip.level,
    icon: tripSportIcon(trip.sport.slug),
    category: trip.category,
    title: trip.title,
    text: trip.text,
    duration: trip.duration,
    date: trip.date,
    price: trip.price,
    priceNote: trip.priceNote,
  }));

  const journalTeasers: JournalTeaser[] = articles.slice(0, 4).map((article) => ({
    href: `/journal/${article.slug}`,
    tag: article.tag,
    title: article.title,
    text: article.excerpt,
  }));

  return (
    <div className={styles.page}>
      <Topbar />
      <Hero />
      <StickySearchStrip />
      <TrustStrip />
      <FeaturedTrips trips={featuredTrips} />
      <DayNight />
      <Included />
      <TripTypes types={tripTypeTiles} />
      <ProgramCta />
      <Reviews />
      <Newsletter />
      <Journal articles={journalTeasers} />
      <Footer />
    </div>
  );
}
