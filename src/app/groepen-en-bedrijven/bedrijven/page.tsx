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

const FIELDS: RequestField[] = [
  { name: "naam", label: "Naam", type: "text", placeholder: "Voor- en achternaam" },
  { name: "email", label: "E-mail", type: "email", placeholder: "naam@voorbeeld.nl" },
  { name: "telefoon", label: "Telefoon", type: "tel", placeholder: "+31 6 …" },
  {
    name: "teamgrootte",
    label: "Teamgrootte",
    type: "select",
    defaultValue: "8 — 20 personen",
    options: ["8 — 20 personen", "20 — 40 personen", "40+ personen"],
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

export default function BedrijvenPage() {
  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="groepen"
        height={560}
        imageLabel="Herobeeld — team aan tafel"
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
        <RequestForm
          title="Aanvraag bedrijfsreis"
          subtitle="Geef aan wat het doel van de reis is — dat bepaalt het programma."
          fields={FIELDS}
          subject="Aanvraag bedrijfsreis"
        />
        <RequestSidebar />
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
