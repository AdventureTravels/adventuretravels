import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { CancellationTier } from "@/lib/cancellation";

export function getPartners() {
  return prisma.partner.findMany({ orderBy: { name: "asc" } });
}

export function getPartnerById(id: string) {
  return prisma.partner.findUnique({ where: { id }, include: { trips: true } });
}

export type PartnerInput = {
  slug: string;
  name: string;
  type: string;
  country: string;
  city: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  commissionPct: string | null;
  cancellationPolicy: CancellationTier[];
  cancellationNotes: string | null;
  isActive: boolean;
};

function toPrismaData(data: PartnerInput) {
  return { ...data, cancellationPolicy: data.cancellationPolicy as unknown as Prisma.InputJsonValue };
}

export function createPartner(data: PartnerInput) {
  return prisma.partner.create({ data: toPrismaData(data) });
}

export function updatePartner(id: string, data: PartnerInput) {
  return prisma.partner.update({ where: { id }, data: toPrismaData(data) });
}

export function deletePartner(id: string) {
  return prisma.partner.delete({ where: { id } });
}
