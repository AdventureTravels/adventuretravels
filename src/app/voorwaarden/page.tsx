import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { LegalPageContent } from "@/components/LegalPageContent";
import { getPageBySlug } from "@/lib/content/pages";
import { stripHtml } from "@/lib/stripHtml";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("voorwaarden");
  if (!page) return {};
  return { title: `${page.title} — AdventureTravels`, description: stripHtml(page.subtitle) };
}

export default async function VoorwaardenPage() {
  const page = await getPageBySlug("voorwaarden");
  if (!page) notFound();

  return (
    <div>
      <Topbar />
      <Nav variant="solid" />
      <LegalPageContent page={page} />
      <TrustStripSimple />
      <Footer />
    </div>
  );
}
