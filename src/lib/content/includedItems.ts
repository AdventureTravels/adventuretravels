import { prisma } from "@/lib/db";

export function getIncludedItems() {
  return prisma.includedItem.findMany({ orderBy: { order: "asc" } });
}

export function getIncludedItemById(id: string) {
  return prisma.includedItem.findUnique({ where: { id } });
}

export type IncludedItemInput = {
  icon: string;
  title: string;
  bodyHtml: string;
  order: number;
};

export function createIncludedItem(data: IncludedItemInput) {
  return prisma.includedItem.create({ data });
}

export function updateIncludedItem(id: string, data: IncludedItemInput) {
  return prisma.includedItem.update({ where: { id }, data });
}

export function deleteIncludedItem(id: string) {
  return prisma.includedItem.delete({ where: { id } });
}
