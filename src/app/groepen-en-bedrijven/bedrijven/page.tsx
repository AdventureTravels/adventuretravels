import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { TwoColInfo } from "@/components/TwoColInfo";
import { StepsGrid } from "@/components/StepsGrid";
import { RequestForm, type GroupInquiryConfig } from "@/components/RequestForm";
import { RequestSidebar } from "@/components/RequestSidebar";
import { turnstileSiteKey } from "@/lib/turnstile";
import styles from "@/styles/requestPage.module.css";

export const metadata: Metadata = {
  title: "Bedrijven — AdventureTravels",
  description: "Teambuilding die niet in een vergaderzaal eindigt.",
};

const STEPS = [
  { number: "01", title: "Aanvraag", text: "Teamgrootte, doel van de reis en periode" },
  { number: "02", title: "Programma + offerte", text: "Voorstel met draaiboek en prijs per persoon" },
  {
    number: "03",
    title: "Boeking op factuur",
    text: "Betaling op rekening, dezelfde voorwaarden als een reguliere reis",
  },
];

const FORM: GroupInquiryConfig = {
  subject: "Aanvraag bedrijfsreis",
  title: "Aanvraag bedrijfsreis",
  subtitle: "Geef aan wat het doel van de reis is; dat bepaalt het programma.",
  groupSizes: ["8 – 20 personen", "20 – 40 personen", "Meer dan 40 personen"],
  sports: ["Wakeboarden"],
  periods: ["Maart – mei", "Juni – augustus", "September – november", "Nog niet bekend"],
  messagePlaceholder: "Doel van de reis, gewenste duur, en wat het team nodig heeft.",
};

export default function BedrijvenPage() {
  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="groepen"
        height={560}
        image=""
        imageAlt=""
        eyebrow="Groepen & bedrijven · Bedrijven"
        title="Teambuilding die niet in een vergaderzaal eindigt."
        subtitle="Teambuilding en incentive-reizen met een sportief programma — georganiseerd zodat jij alleen hoeft aan te schuiven."
        meta={["Vanaf 8 personen", "April — oktober", "Factuur op rekening"]}
      />

      <TwoColInfo
        items={[
          {
            title: "Voor wie",
            text: "Teams en bedrijven die een incentive of teamweek willen met inhoud: sport overdag, ruimte om te praten in de avond.",
          },
          {
            title: "Wat we regelen",
            text: "Programma, verblijf, catering en transfers. Eén factuur, één contactpersoon, en een draaiboek dat je intern kunt doorsturen.",
          },
        ]}
      />

      <div className={styles.stepsSection}>
        <h2 className={styles.stepsTitle}>Hoe het werkt</h2>
        <StepsGrid steps={STEPS} />
      </div>

      <div className={styles.requestSection}>
        <RequestForm config={FORM} siteKey={turnstileSiteKey()} />
        <RequestSidebar />
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
