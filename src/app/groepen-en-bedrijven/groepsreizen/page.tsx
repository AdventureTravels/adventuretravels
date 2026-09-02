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
  title: "Groepsreizen — AdventureTravels",
  description: "Met je eigen groep het water op.",
};

const STEPS = [
  { number: "01", title: "Aanvraag", text: "Gewenste sport, periode en groepsgrootte" },
  { number: "02", title: "Programma + offerte", text: "Wij stellen een voorstel op" },
  {
    number: "03",
    title: "Boeking",
    text: "Na akkoord dezelfde boekings- en betaalflow als een reguliere reis",
  },
];

const FORM: GroupInquiryConfig = {
  subject: "Aanvraag groepsreis",
  title: "Aanvraag groepsreis",
  subtitle: "Hoe concreter je aanvraag, hoe scherper ons voorstel.",
  groupSizes: ["6 – 12 personen", "13 – 20 personen", "Meer dan 20 personen"],
  sports: ["Wakeboarden"],
  periods: ["Maart – mei", "Juni – augustus", "September – november", "Nog niet bekend"],
  messagePlaceholder: "Wat is de gelegenheid, en wat is voor jullie belangrijk?",
};

export default function GroepsreizenPage() {
  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="groepen"
        height={560}
        image=""
        imageAlt=""
        eyebrow="Groepen & bedrijven · Groepsreizen"
        title="Met je eigen groep het water op."
        subtitle="Voor vriendengroepen en verenigingen die samen willen sporten — één programma, één aanspreekpunt, één factuur."
        meta={["Vanaf 6 personen", "April — oktober", "Alle niveaus"]}
      />

      <TwoColInfo
        items={[
          {
            title: "Voor wie",
            text: "Vriendengroepen en verenigingen van zes personen of meer, met gemengde niveaus. Iedereen sport op eigen tempo, het programma blijft hetzelfde.",
          },
          {
            title: "Wat je krijgt",
            text: "Een vast dagritme op de kabel, verblijf en avondmaaltijden geregeld, en een gids die de groep bij elkaar houdt.",
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
