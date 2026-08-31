import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { TwoColInfo } from "@/components/TwoColInfo";
import { StepsGrid } from "@/components/StepsGrid";
import { RequestForm, RequestSidebar, type RequestField } from "@/components/RequestForm";
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

const FIELDS: RequestField[] = [
  { name: "naam", label: "Naam", type: "text", placeholder: "Voor- en achternaam" },
  { name: "email", label: "E-mail", type: "email", placeholder: "naam@voorbeeld.nl" },
  { name: "telefoon", label: "Telefoon", type: "tel", placeholder: "+31 6 …" },
  {
    name: "groepsgrootte",
    label: "Groepsgrootte",
    type: "select",
    defaultValue: "6 — 12 personen",
    options: ["6 — 12 personen", "13 — 20 personen", "20+ personen"],
  },
  {
    name: "sport",
    label: "Gewenste sport",
    type: "select",
    defaultValue: "Wakeboarden",
    options: ["Wakeboarden"],
  },
  {
    name: "periode",
    label: "Periode",
    type: "select",
    defaultValue: "Mei — september",
    options: ["April", "Mei — september", "Oktober"],
  },
  {
    name: "budget",
    label: "Budgetindicatie",
    type: "select",
    defaultValue: "€ 750 — € 1.000 p.p.",
    options: ["Tot € 750 p.p.", "€ 750 — € 1.000 p.p.", "€ 1.000+ p.p."],
  },
  {
    name: "toelichting",
    label: "Toelichting",
    type: "textarea",
    placeholder: "Wat is de gelegenheid, en wat is voor jullie belangrijk?",
  },
];

export default function GroepsreizenPage() {
  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="groepen"
        height={560}
        imageLabel="Herobeeld — groep op de kabel"
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
        <RequestForm
          title="Aanvraag groepsreis"
          subtitle="Hoe concreter je aanvraag, hoe scherper ons voorstel."
          fields={FIELDS}
          subject="Aanvraag groepsreis"
        />
        <RequestSidebar />
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
