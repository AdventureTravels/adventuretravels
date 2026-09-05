import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { PageIntro } from "@/components/PageIntro";
import { JournalCategoryNav } from "@/components/JournalCategoryNav";
import { JournalGrid } from "@/components/JournalGrid";
import { getArticles, getArticleCategories } from "@/lib/content/articles";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Journal — AdventureTravels",
  description: "Leren wakeboarden, materiaal, het weer in Antalya en het kiezen van een sportvakantie: praktische artikelen van het team.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const [articles, categories] = await Promise.all([getArticles(), getArticleCategories()]);

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="journal" />

      <PageIntro
        eyebrow="Journal"
        title="Praktische antwoorden van mensen die zelf rijden."
        subtitle="Over leren, materiaal, het seizoen en de plekken waar we komen."
      />

      <JournalCategoryNav categories={categories.map((c) => ({ slug: c.slug, name: c.name, count: c._count.articles }))} />
      <JournalGrid articles={articles} />

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
