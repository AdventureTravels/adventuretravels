import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export function getPages() {
  return prisma.page.findMany({ orderBy: { slug: "asc" } });
}

export function getPageBySlug(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

export function getPageById(id: string) {
  return prisma.page.findUnique({ where: { id } });
}

export type PageSection = {
  title: string;
  bodyHtml: string;
  kind?: "text" | "stats" | "table" | "icons";
  data?: unknown;
};

export type PageInput = {
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: PageSection[];
  extra?: unknown;
};

export function updatePage(id: string, data: PageInput) {
  return prisma.page.update({
    where: { id },
    data: {
      ...data,
      sections: data.sections as unknown as Prisma.InputJsonValue,
      extra: data.extra === undefined ? undefined : (data.extra as unknown as Prisma.InputJsonValue),
    },
  });
}
