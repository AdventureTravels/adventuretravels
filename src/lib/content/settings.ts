import { cache } from "react";
import { prisma } from "@/lib/db";

const SINGLETON_ID = "singleton";

/** Per request gededupliceerd (React cache): Hero, HeroBanner, Topbar en Footer
 * lezen dezelfde rij. */
export const getSiteSettings = cache(() =>
  prisma.siteSettings.findUniqueOrThrow({ where: { id: SINGLETON_ID } }),
);

export type SiteSettingsInput = {
  topbarTagline: string;
  phone: string;
  email: string;
  heroEyebrow: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  heroVideoUrl: string;
  usps: string[];
  dayImage: string;
  eveningImage: string;
  programCtaEyebrow: string;
  programCtaTitle: string;
  programCtaBody: string;
  programPdfUrl: string;
  infoFormPdfUrl: string;
  footerTagline: string;
};

export function updateSiteSettings(data: SiteSettingsInput) {
  return prisma.siteSettings.update({ where: { id: SINGLETON_ID }, data });
}
