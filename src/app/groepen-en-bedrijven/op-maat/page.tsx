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
  title: "Op maat — AdventureTravels",
  description: "Een reis die precies om jullie heen is gebouwd.",
};

const STEPS = [
  { number: "01", title: "Intakegesprek", text: "We bespreken sport, niveau, periode en budget" },
  { number: "02", title: "Voorstel op maat", text: "Concept-programma met verblijf en prijsopbouw" },
  { number: "03", title: "Bijstellen", text: "Eén of twee rondes tot het klopt" },
  {
    number: "04",
    title: "Boeking",
    text: "Dezelfde boekings- en betaalflow als een reguliere reis",
  },
];

const FIELDS: RequestField[] = [
  { name: "naam", label: "Naam", type: "text", placeholder: "Voor- en achternaam" },
  { name: "email", label: "E-mail", type: "email", placeholder: "naam@voorbeeld.nl" },
  { name: "telefoon", label: "Telefoon", type: "tel", placeholder: "+31 6 …" },
  {
    name: "personen",
    label: "Aantal personen",
    type: "select",
    defaultValue: "2 — 4 personen",
    options: ["2 — 4 personen", "5 — 8 personen", "8+ personen"],
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

export default function OpMaatPage() {
  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="groepen"
        height={560}
        imageLabel="Herobeeld — avond aan het water"
        eyebrow="Groepen & bedrijven · Op maat"
        title="Een reis die precies om jullie heen is gebouwd."
        subtitle="Een reis volledig naar eigen wens samengesteld — sport, verblijf, duur en tempo bepalen jullie."
        meta={["Vanaf 2 personen", "Jaarrond", "Alle niveaus"]}
      />

      <TwoColInfo
        items={[
          {
            title: "Voor wie",
            text: "Reizigers met een specifieke wens: een eigen datum, een ander verblijfsniveau, een combinatie van sporten of extra dagen aan de kust.",
          },
          {
            title: "Wat we vastleggen",
            text: "Programma, verblijf, transfers en niveaubegeleiding. Alles wat we voorstellen hebben we zelf gezien.",
          },
        ]}
      />

      <div className={styles.stepsSection}>
        <h2 className={styles.stepsTitle}>Hoe het werkt</h2>
        <StepsGrid steps={STEPS} />
      </div>

      <div className={styles.requestSection}>
        <RequestForm
          title="Aanvraag reis op maat"
          subtitle="Vertel wat je in gedachten hebt — we werken het uit."
          fields={FIELDS}
          subject="Aanvraag reis op maat"
        />
        <RequestSidebar />
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
