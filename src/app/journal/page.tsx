import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { PageIntro } from "@/components/PageIntro";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticles } from "@/lib/content/articles";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Journal — AdventureTravels",
  description: "Verhalen van onderweg.",
};

export default async function JournalPage() {
  const articles = await getArticles();

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="journal" />

      <PageIntro
        eyebrow="Verhalen"
        title="Verhalen van onderweg."
        subtitle="Praktische inzichten en reisverhalen van het team en van gasten."
      />

      {articles.length > 0 && (
        <div className={styles.grid}>
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              href={`/journal/${article.slug}`}
              image={article.heroImage}
              tag={article.tag}
              title={article.title}
              text={article.excerpt}
            />
          ))}
        </div>
      )}

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
