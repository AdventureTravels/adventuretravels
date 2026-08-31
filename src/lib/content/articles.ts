import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export function getArticles() {
  return prisma.article.findMany({ orderBy: { order: "asc" } });
}

export function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({ where: { slug } });
}

export function getArticleById(id: string) {
  return prisma.article.findUnique({ where: { id } });
}

export type ArticleSection = { number?: string; title: string; bodyHtml: string; quoteHtml?: string };

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
