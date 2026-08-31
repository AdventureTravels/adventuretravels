import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { TripCard } from "@/components/TripCard";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import { SunMark } from "@/components/icons";
import { getArticleBySlug } from "@/lib/content/articles";
import type { ArticleSection } from "@/lib/content/articles";
import { getTrips } from "@/lib/content/trips";
import { toTripCardData } from "@/lib/tripCard";
import { RichText } from "@/components/RichText";
import styles from "./page.module.css";

const SLUG = "antalya-warm-water";

export async function generateMetadata(): Promise<Metadata> {
  const article = await getArticleBySlug(SLUG);
  if (!article) return {};
  return {
    title: `${article.title} — AdventureTravels Journal`,
    description: article.excerpt,
  };
}

export default async function AntalyaWarmWaterArticlePage() {
  const article = await getArticleBySlug(SLUG);
  if (!article) notFound();

  const sections = article.sections as unknown as ArticleSection[];
  const trips = await getTrips();
  const relatedTrip = trips[0];

  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="journal"
        height={560}
        imageLabel={article.heroImage}
        eyebrow={`${article.tag} · ${article.publishedAt}`}
        title={article.title}
      />

      <div className={styles.body}>
        <div className={styles.main}>
          <RichText html={article.intro} className={styles.intro} />
          {sections.map((section) => (
            <div key={section.title} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <RichText html={section.bodyHtml} className={styles.sectionText} />
              {section.quoteHtml && <RichText html={section.quoteHtml} className={styles.quote} />}
            </div>
          ))}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.tocCard}>
            <span className={styles.tocLabel}>In dit artikel</span>
            <div className={styles.tocList}>
              {sections.map((section, i) => (
                <span
                  key={section.title}
                  className={i === 0 ? `${styles.tocItem} ${styles.tocItemActive}` : styles.tocItem}
                >
                  {section.title}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.guideCard}>
            <SunMark size={48} />
            <div className={styles.guideTitle}>Vraag het aan een gids</div>
            <p className={styles.guideText}>+31 20 244 18 60</p>
          </div>
        </div>
      </div>

      <div className={styles.related}>
        <div className={styles.relatedHead}>
          <h2 className={styles.relatedTitle}>Gerelateerde reizen</h2>
          <a href="/reizen" className={styles.relatedViewAll}>
            Alle reizen
          </a>
        </div>
        <div className={styles.relatedGrid}>
          {relatedTrip && (
            <TripCard
              trip={{
                ...toTripCardData(relatedTrip),
                text: "Vijf dagen op de kabel, verblijf bij het park inbegrepen.",
              }}
              ctaLabel="Bekijk deze reis"
            />
          )}
          <ComingSoonTile text="Meer reizen naar Turkije volgen" height={300} />
        </div>
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
