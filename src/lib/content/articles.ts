import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export const ARTICLE_INCLUDE = { category: true } satisfies Prisma.ArticleInclude;
export type ArticleWithCategory = Prisma.ArticleGetPayload<{ include: typeof ARTICLE_INCLUDE }>;

export function getArticles() {
  return prisma.article.findMany({ orderBy: { order: "asc" }, include: ARTICLE_INCLUDE });
}

export function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({ where: { slug }, include: ARTICLE_INCLUDE });
}

export function getArticleById(id: string) {
  return prisma.article.findUnique({ where: { id }, include: ARTICLE_INCLUDE });
}

/** Categorieën met artikelaantal; lege categorieën worden op de site niet getoond. */
export function getArticleCategories() {
  return prisma.articleCategory.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { articles: true } } } });
}

export function getArticleCategoryBySlug(slug: string) {
  return prisma.articleCategory.findUnique({
    where: { slug },
    include: { articles: { orderBy: { order: "asc" }, include: ARTICLE_INCLUDE } },
  });
}

export type ArticleFaq = { question: string; answer: string };
/** Een sectie met `faq` wordt als vraag-en-antwoordblok gerenderd én als FAQPage-structured data uitgestuurd. */
export type ArticleSection = { number?: string; title: string; bodyHtml: string; quoteHtml?: string; faq?: ArticleFaq[] };

export type ArticleInput = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  heroImage: string;
  intro: string;
  sections: ArticleSection[];
  calloutLabel?: string | null;
  calloutText?: string | null;
  publishedAt: string;
  order: number;
  categoryId: string | null;
};

function toPrismaData(data: ArticleInput) {
  return {
    ...data,
    sections: data.sections as unknown as Prisma.InputJsonValue,
  };
}

export function createArticle(data: ArticleInput) {
  return prisma.article.create({ data: toPrismaData(data) });
}

export function updateArticle(id: string, data: ArticleInput) {
  return prisma.article.update({ where: { id }, data: toPrismaData(data) });
}

export function deleteArticle(id: string) {
  return prisma.article.delete({ where: { id } });
}

export type ArticleCategoryInput = { slug: string; name: string; description: string; order: number };

export function createArticleCategory(data: ArticleCategoryInput) {
  return prisma.articleCategory.create({ data });
}

export function updateArticleCategory(id: string, data: ArticleCategoryInput) {
  return prisma.articleCategory.update({ where: { id }, data });
}

export function deleteArticleCategory(id: string) {
  return prisma.articleCategory.delete({ where: { id } });
}
