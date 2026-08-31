import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const SINGLETON_ID = "singleton";

export function getSiteSettings() {
  return prisma.siteSettings.findUniqueOrThrow({ where: { id: SINGLETON_ID } });
}

export type TrustStat = { value: string; label: string };

export type SiteSettingsInput = {
  topbarTagline: string;
  phone: string;
  email: string;
  heroEyebrow: string;
  heroHeading: string;
  heroSubheading: string;
  trustStats: TrustStat[];
  programCtaEyebrow: string;
  programCtaTitle: string;
  programCtaBody: string;
  newsletterTitle: string;
  footerTagline: string;
};

export function updateSiteSettings(data: SiteSettingsInput) {
  return prisma.siteSettings.update({
    where: { id: SINGLETON_ID },
    data: { ...data, trustStats: data.trustStats as unknown as Prisma.InputJsonValue },
  });
}
