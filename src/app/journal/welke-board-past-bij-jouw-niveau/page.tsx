import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { TripCard } from "@/components/TripCard";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import { WaveIcon, ArrowIcon } from "@/components/icons";
import { getArticleBySlug } from "@/lib/content/articles";
import type { ArticleSection } from "@/lib/content/articles";
import { getTrips } from "@/lib/content/trips";
import { toTripCardData } from "@/lib/tripCard";
import { RichText } from "@/components/RichText";
import styles from "./page.module.css";

const SLUG = "welke-board-past-bij-jouw-niveau";

export async function generateMetadata(): Promise<Metadata> {
  const article = await getArticleBySlug(SLUG);
  if (!article) return {};
  return {
    title: `${article.title} — AdventureTravels Journal`,
    description: article.excerpt,
  };
}

export default async function WelkeBoardArticlePage() {
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
              <div className={styles.sectionHead}>
                <span className={styles.sectionNumber}>{section.number}</span>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
              </div>
              <RichText html={section.bodyHtml} className={styles.sectionText} />
            </div>
          ))}

          {article.calloutLabel && article.calloutText && (
            <div className={styles.callout}>
              <span className={styles.calloutLabel}>{article.calloutLabel}</span>
              <RichText html={article.calloutText} className={styles.calloutText} />
            </div>
          )}
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
          <div className={styles.materialCard}>
            <WaveIcon size={26} color="#E3DDCD" strokeWidth={1.8} waves={2} />
            <div className={styles.materialTitle}>Materiaal inbegrepen</div>
            <p className={styles.materialText}>
              Bij elke wakeboardreis zit board, bindingen en vest bij de prijs.
            </p>
          </div>
          <div className={styles.guideCard}>
            <span className={styles.guideLabel}>Twijfel over je niveau</span>
            <div className={styles.guidePhone}>+31 20 244 18 60</div>
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
                text: "Vijf dagen op de kabel, materiaal en verblijf inbegrepen.",
              }}
              ctaLabel="Bekijk deze reis"
            />
          )}
          <ComingSoonTile text="Meer wakeboardreizen volgen" height={300} />
          <a href="/journal/antalya-warm-water" className={styles.crossLinkCard}>
            <div className={styles.crossLinkTop}>
              <span className={styles.crossLinkLabel}>Verder lezen</span>
              <h3 className={styles.crossLinkTitle}>Waarom Antalya jaarrond warm water heeft</h3>
              <p className={styles.crossLinkMeta}>Turkije · 5 min</p>
            </div>
            <span className={styles.crossLinkCta}>
              Lees verder
              <ArrowIcon size={14} />
            </span>
          </a>
        </div>
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
