import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getTrips } from "@/lib/content/trips";
import { getArticles, getArticleCategories } from "@/lib/content/articles";
import { SITE_URL } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

/** Sitemap uit de database: alleen publiceerbare reizen, alle artikelen, gevulde categorieën en de vaste pagina's. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [trips, articles, categories, sports, destinations] = await Promise.all([
    getTrips(),
    getArticles(),
    getArticleCategories(),
    prisma.sport.findMany({ select: { slug: true } }),
    prisma.destination.findMany({ select: { slug: true } }),
  ]);
  const url = (path: string) => `${SITE_URL}${path}`;

  const fixed = ["/", "/reizen", "/sporten", "/bestemmingen", "/verblijf", "/journal", "/over-ons", "/vertrouwen", "/faq", "/contact", "/spreek-een-gids", "/groepen-en-bedrijven", "/groepen-en-bedrijven/groepsreizen", "/groepen-en-bedrijven/bedrijven", "/groepen-en-bedrijven/op-maat", "/voorwaarden", "/privacy", "/annuleringsvoorwaarden"];

  return [
    ...fixed.map((p) => ({ url: url(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.6 })),
    ...trips.map((t) => ({ url: url(`/reizen/${t.slug}`), changeFrequency: "weekly" as const, priority: 0.9 })),
    ...sports.map((s) => ({ url: url(`/sporten/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...destinations.map((d) => ({ url: url(`/bestemmingen/${d.slug}`), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...articles.map((a) => ({ url: url(`/journal/${a.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...categories.filter((c) => c._count.articles > 0).map((c) => ({ url: url(`/journal/categorie/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}
