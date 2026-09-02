import { prisma } from "@/lib/db";

export function getGuides() {
  return prisma.guide.findMany({ orderBy: { name: "asc" } });
}

export function getGuideById(id: string) {
  return prisma.guide.findUnique({ where: { id } });
}

export type GuideInput = {
  name: string;
  bio: string;
  photo: string;
  photoAlt: string;
  phone: string;
  livesIn: string;
  sports: string[];
};

export function createGuide(data: GuideInput) {
  return prisma.guide.create({ data });
}

export function updateGuide(id: string, data: GuideInput) {
  return prisma.guide.update({ where: { id }, data });
}

export function deleteGuide(id: string) {
  return prisma.guide.delete({ where: { id } });
}
