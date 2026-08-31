import { prisma } from "@/lib/db";

export function getFaqItems() {
  return prisma.faqItem.findMany({ orderBy: { order: "asc" } });
}

export function getFaqItemById(id: string) {
  return prisma.faqItem.findUnique({ where: { id } });
}

export type FaqItemInput = {
  question: string;
  answer: string;
  order: number;
};

export function createFaqItem(data: FaqItemInput) {
  return prisma.faqItem.create({ data });
}

export function updateFaqItem(id: string, data: FaqItemInput) {
  return prisma.faqItem.update({ where: { id }, data });
}

export function deleteFaqItem(id: string) {
  return prisma.faqItem.delete({ where: { id } });
}
