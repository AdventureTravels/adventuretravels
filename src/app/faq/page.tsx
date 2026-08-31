import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { PageIntro } from "@/components/PageIntro";
import { ArrowIcon, SunMark } from "@/components/icons";
import { FaqAccordion } from "./FaqAccordion";
import { getFaqItems } from "@/lib/content/faq";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Veelgestelde vragen — AdventureTravels",
  description: "Antwoorden op de meest gestelde vragen over aanbetaling, annuleren, niveau en verzekering.",
};

export default async function FaqPage() {
  const faqs = await getFaqItems();

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" />

      <PageIntro eyebrow="Praktisch" title="Veelgestelde vragen" />

      <div className={styles.layout}>
        <FaqAccordion faqs={faqs} />
        <div className={styles.sidebar}>
          <SunMark size={58} />
          <div className={styles.sidebarTitle}>Vraag er niet tussen?</div>
          <p className={styles.sidebarText}>We reageren binnen 1 werkdag.</p>
          <a href="/contact" className={styles.sidebarCta}>
            Naar contact
            <ArrowIcon size={14} />
          </a>
        </div>
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
