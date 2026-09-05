import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { PageIntro } from "@/components/PageIntro";
import { JournalCategoryNav } from "@/components/JournalCategoryNav";
import { JournalGrid } from "@/components/JournalGrid";
import { getArticleCategories, getArticleCategoryBySlug } from "@/lib/content/articles";
import styles from "@/app/journal/page.module.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getArticleCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} — Journal — AdventureTravels`,
    description: category.description || `Artikelen over ${category.name.toLowerCase()}.`,
    alternates: { canonical: `/journal/categorie/${category.slug}` },
  };
}

export default async function JournalCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, categories] = await Promise.all([getArticleCategoryBySlug(slug), getArticleCategories()]);
  if (!category || category.articles.length === 0) notFound();

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="journal" />
      <PageIntro eyebrow="Journal" title={category.name} subtitle={category.description || undefined} />
      <JournalCategoryNav categories={categories.map((c) => ({ slug: c.slug, name: c.name, count: c._count.articles }))} activeSlug={category.slug} />
      <JournalGrid articles={category.articles} />
      <TrustStripSimple />
      <Footer />
    </div>
  );
}
