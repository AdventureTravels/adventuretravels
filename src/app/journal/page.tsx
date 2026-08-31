import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { PageIntro } from "@/components/PageIntro";
import { ArticleCard } from "@/components/ArticleCard";
import { ComingSoonTile } from "@/components/ComingSoonTile";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Journal — AdventureTravels",
  description: "Verhalen van onderweg.",
};

export default function JournalPage() {
  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="journal" />

      <PageIntro
        eyebrow="Verhalen"
        title="Verhalen van onderweg."
        subtitle="Praktische inzichten en reisverhalen van het team en van gasten."
      />

      <div className={styles.grid}>
        <ArticleCard
          href="/journal/antalya-warm-water"
          image="Artikelfoto — Antalya"
          tag="Turkije · 5 min"
          title="Waarom Antalya jaarrond warm water heeft"
          text="Wat het seizoen bepaalt voor je sessies op de kabel."
        />
        <ArticleCard
          href="/journal/welke-board-past-bij-jouw-niveau"
          image="Artikelfoto — materiaal"
          tag="Materiaal · 4 min"
          title="Welke board past bij jouw niveau"
          text="Praktisch overzicht voor beginners en gevorderden."
        />
        <ComingSoonTile text="Meer artikelen volgen" height={420} />
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
