import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { TripCard } from "@/components/TripCard";
import { getArticleBySlug } from "@/lib/content/articles";
import type { ArticleSection } from "@/lib/content/articles";
import { getTrips } from "@/lib/content/trips";
import { toTripCardData } from "@/lib/tripCard";
import { RichText } from "@/components/RichText";
import { SITE_URL } from "@/lib/siteUrl";
import { stripHtml } from "@/lib/stripHtml";
import { isImageUrl } from "@/components/SiteImage";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — AdventureTravels Journal`,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt, url: `${SITE_URL}/journal/${article.slug}` },
  };
}

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const sections = article.sections as unknown as ArticleSection[];
  const trips = await getTrips();
  const faqs = sections.flatMap((s) => s.faq ?? []);

  // Structured data voor zoekmachines en AI-antwoorden: Article + FAQPage (alleen als er vragen zijn).
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      inLanguage: "nl",
      url: `${SITE_URL}/journal/${article.slug}`,
      ...(isImageUrl(article.heroImage) ? { image: article.heroImage } : {}),
      author: { "@type": "Organization", name: "AdventureTravels", url: SITE_URL },
      publisher: { "@type": "Organization", name: "AdventureTravels", url: SITE_URL },
    },
    ...(faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: stripHtml(f.answer) },
            })),
          },
        ]
      : []),
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Topbar />
      <Nav variant="solid" active="journal" />
      <HeroBanner
        active="journal"
        height={480}
        image={article.heroImage}
        imageAlt={article.title}
        eyebrow={`${article.tag} · ${article.publishedAt}`}
        title={article.title}
      />

      <div className={styles.page}>
        <div className={styles.body}>
          <RichText html={article.intro} className={styles.intro} />
          {sections.map((section) => (
            <div key={section.title} className={styles.section}>
              <div className={styles.sectionHead}>
                {section.number && <span className={styles.sectionNumber}>{section.number}</span>}
                <h2 className={styles.sectionTitle}>{section.title}</h2>
              </div>
              {section.bodyHtml && <RichText html={section.bodyHtml} className={styles.sectionText} />}
              {section.quoteHtml && <RichText html={section.quoteHtml} className={styles.quote} />}
              {section.faq && section.faq.length > 0 && (
                <dl className={styles.faq}>
                  {section.faq.map((f) => (
                    <div key={f.question} className={styles.faqItem}>
                      <dt className={styles.faqQuestion}>{f.question}</dt>
                      <dd className={styles.faqAnswer}>
                        <RichText html={f.answer} />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          ))}
          {article.calloutLabel && article.calloutText && (
            <div className={styles.callout}>
              <span className={styles.calloutLabel}>{article.calloutLabel}</span>
              <RichText html={article.calloutText} className={styles.calloutText} />
            </div>
          )}
        </div>

        {trips.length > 0 && (
          <div className={styles.related}>
            <div className={styles.relatedHead}>
              <h2 className={styles.relatedTitle}>Onze reizen</h2>
              <Link href="/reizen" className={styles.relatedViewAll}>
                Alle reizen
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {trips.slice(0, 2).map((trip) => (
                <TripCard key={trip.slug} trip={toTripCardData(trip)} ctaLabel="Bekijk deze reis" />
              ))}
            </div>
          </div>
        )}
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
