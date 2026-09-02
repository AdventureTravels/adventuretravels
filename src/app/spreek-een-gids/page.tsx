import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { PageIntro } from "@/components/PageIntro";
import { RequestSidebar } from "@/components/RequestSidebar";
import { getTripBySlug } from "@/lib/content/trips";
import { turnstileSiteKey } from "@/lib/turnstile";
import { GuideForm } from "./GuideForm";
import styles from "@/styles/requestPage.module.css";

export const metadata: Metadata = {
  title: "Spreek een gids — AdventureTravels",
  description: "Twijfel over je niveau of je board? Een gids belt je terug.",
};

export default async function GuideCallbackPage({ searchParams }: { searchParams: Promise<{ reis?: string }> }) {
  const { reis } = await searchParams;
  const trip = reis ? await getTripBySlug(reis) : null;

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" />
      <PageIntro
        eyebrow="Spreek een gids"
        title="Twijfel over je niveau? Bel met iemand die zelf rijdt."
        subtitle="Geen verkoopgesprek. Een gids die het park kent, kijkt met je mee welk niveau en welke reis bij je past."
      />
      <div className={styles.requestSection}>
        <GuideForm tripId={trip?.id ?? null} tripTitle={trip?.title ?? null} siteKey={turnstileSiteKey()} />
        <RequestSidebar />
      </div>
      <TrustStripSimple />
      <Footer />
    </div>
  );
}
