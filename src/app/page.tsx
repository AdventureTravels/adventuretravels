import { Topbar } from "@/components/Topbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { DayNight } from "@/components/DayNight";
import { Included } from "@/components/Included";
import { TripTypes, type TripTypeTile } from "@/components/TripTypes";
import { CategoryStrip, type CategoryStripItem } from "@/components/CategoryStrip";
import { PinIcon } from "@/components/icons";
import { ProgramCta } from "@/components/ProgramCta";
import { Reviews } from "@/components/Reviews";
import { Journal, type JournalTeaser } from "@/components/Journal";
import { Footer } from "@/components/Footer";
import { getTrips } from "@/lib/content/trips";
import { getArticles } from "@/lib/content/articles";
import { getTripTypes } from "@/lib/content/tripTypes";
import { getSports } from "@/lib/content/sports";
import { getDestinations } from "@/lib/content/destinations";
import { toTripCardData, tripSportIcon } from "@/lib/tripCard";
import { renderIcon } from "@/lib/iconLookup";
import styles from "./page.module.css";

export default async function Home() {
  const [trips, articles, tripTypes, sports, destinations] = await Promise.all([
    getTrips(),
    getArticles(),
    getTripTypes(),
    getSports(),
    getDestinations(),
  ]);

  // Aantal gepubliceerde reizen per categorie: zonder reizen zegt de kaart dat
  // eerlijk, in plaats van te doen alsof er al iets te boeken is.
  const tripsPerSport = new Map<string, number>();
  const tripsPerDestination = new Map<string, number>();
  for (const trip of trips) {
    tripsPerSport.set(trip.sport.slug, (tripsPerSport.get(trip.sport.slug) ?? 0) + 1);
    tripsPerDestination.set(trip.destination.slug, (tripsPerDestination.get(trip.destination.slug) ?? 0) + 1);
  }
  const reizenLabel = (count: number) => (count === 0 ? "In voorbereiding" : `${count} ${count === 1 ? "reis" : "reizen"}`);

  const sportItems: CategoryStripItem[] = sports.map((sport) => ({
    key: sport.id,
    href: `/sporten/${sport.slug}`,
    image: sport.cardImage,
    imageAlt: sport.name,
    icon: tripSportIcon(sport, { size: 24, color: "#FFFFFF" }),
    name: sport.name,
    subLabel: reizenLabel(tripsPerSport.get(sport.slug) ?? 0),
    caption: sport.caption,
  }));

  const destinationItems: CategoryStripItem[] = destinations.map((destination) => ({
    key: destination.id,
    href: `/bestemmingen/${destination.slug}`,
    image: destination.cardImage,
    imageAlt: destination.name,
    icon: <PinIcon size={22} color="#FFFFFF" strokeWidth={2.6} />,
    name: destination.name,
    subLabel: reizenLabel(tripsPerDestination.get(destination.slug) ?? 0),
    caption: [destination.caption, destination.bestPeriod].filter(Boolean).join(" · "),
  }));

  const tripTypeTiles: TripTypeTile[] = tripTypes.map((type) => ({
    href: type.href,
    icon: renderIcon(type.icon, { size: 40, strokeWidth: 1.6 }),
    title: type.title,
    meta: type.meta,
  }));

  const tripCards = trips.map(toTripCardData);

  const journalTeasers: JournalTeaser[] = articles.slice(0, 4).map((article) => ({
    href: `/journal/${article.slug}`,
    tag: [article.category?.name, article.tag].filter(Boolean).join(" · "),
    title: article.title,
    text: article.excerpt,
  }));

  return (
    <div className={styles.page}>
      <Topbar />
      <Hero trips={tripCards} />
      <TrustStrip />
      <DayNight />
      <Included />
      <TripTypes types={tripTypeTiles} />
      <CategoryStrip
        title="Wat je bij ons doet"
        note="Categorieën zonder reizen zijn in voorbereiding"
        ctaLabel="Bekijk categorie"
        items={sportItems}
      />
      <CategoryStrip title="Waar we naartoe gaan" ctaLabel="Bekijk bestemming" items={destinationItems} />
      <ProgramCta />
      <Reviews />
      <Journal articles={journalTeasers} />
      <Footer />
    </div>
  );
}
