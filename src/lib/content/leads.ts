import { prisma } from "@/lib/db";

export type LeadType = "pdf_request" | "guide_callback" | "group_inquiry";

export type LeadInput = {
  type: LeadType;
  name: string;
  email: string;
  phone?: string | null;
  tripId?: string | null;
  preferredDay?: string | null;
  preferredDaypart?: string | null;
  message?: string | null;
  newsletterOptIn?: boolean;
  sourceUrl?: string | null;
};

export function createLead(data: LeadInput) {
  return prisma.lead.create({ data });
}

export function getLeads(type?: LeadType) {
  return prisma.lead.findMany({
    where: type ? { type } : {},
    orderBy: { createdAt: "desc" },
    include: { trip: { select: { title: true, slug: true } } },
  });
}
