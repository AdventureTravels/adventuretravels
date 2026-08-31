import { prisma } from "@/lib/db";

export function getSports() {
  return prisma.sport.findMany({ orderBy: { order: "asc" } });
}

export function getSportBySlug(slug: string) {
  return prisma.sport.findUnique({ where: { slug } });
}

export function getSportById(id: string) {
  return prisma.sport.findUnique({ where: { id } });
}

export type SportInput = {
  slug: string;
  name: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  cardImage: string;
  caption: string;
  order: number;
};

export function createSport(data: SportInput) {
  return prisma.sport.create({ data });
}

export function updateSport(id: string, data: SportInput) {
  return prisma.sport.update({ where: { id }, data });
}

export function deleteSport(id: string) {
  return prisma.sport.delete({ where: { id } });
}

export function setSportMailerliteGroupId(id: string, mailerliteGroupId: string) {
  return prisma.sport.update({ where: { id }, data: { mailerliteGroupId } });
}
