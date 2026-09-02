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

const FORM: GroupInquiryConfig = {
  subject: "Aanvraag reis op maat",
  title: "Aanvraag reis op maat",
  subtitle: "Vertel wat je voor ogen hebt; wij vertalen het naar een programma.",
  groupSizes: ["2 – 5 personen", "6 – 12 personen", "Meer dan 12 personen"],
  sports: ["Wakeboarden"],
  periods: ["Maart – mei", "Juni – augustus", "September – november", "Nog niet bekend"],
  messagePlaceholder: "Sport, verblijf, duur, tempo: wat moet er anders dan bij een standaardreis?",
};

export default function OpMaatPage() {
  return (
    <div className={styles.page}>
      <Topbar />
      <HeroBanner
        active="groepen"
        height={560}
        image=""
        imageAlt=""
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
        <RequestForm config={FORM} siteKey={turnstileSiteKey()} />
        <RequestSidebar />
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
