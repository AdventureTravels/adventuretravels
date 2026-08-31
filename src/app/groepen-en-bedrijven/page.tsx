import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { PageIntro } from "@/components/PageIntro";
import { StepsGrid } from "@/components/StepsGrid";
import { ArrowIcon, WaveIcon, CompassIcon, HouseIcon } from "@/components/icons";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Groepen & bedrijven — AdventureTravels",
  description: "Niet alleen. Maar wel op maat.",
};

const PROPOSITIONS = [
  {
    href: "/groepen-en-bedrijven/groepsreizen",
    icon: <WaveIcon size={30} color="#23261F" strokeWidth={1.8} />,
    title: "Groepsreizen",
    text: "Voor vriendengroepen en verenigingen die samen willen sporten.",
    cta: "Bekijk groepsreizen",
  },
  {
    href: "/groepen-en-bedrijven/op-maat",
    icon: <CompassIcon size={30} color="#23261F" strokeWidth={1.8} />,
    title: "Op maat",
    text: "Een reis volledig naar eigen wens samengesteld.",
    cta: "Vraag reis op maat aan",
  },
  {
    href: "/groepen-en-bedrijven/bedrijven",
    icon: <HouseIcon size={30} color="#23261F" strokeWidth={1.8} door />,
    title: "Bedrijven",
    text: "Teambuilding en incentive-reizen met een sportief programma.",
    cta: "Vraag bedrijfsuitje aan",
  },
];

const STEPS = [
  { number: "01", title: "Aanvraag", text: "Gewenste sport, periode en groepsgrootte" },
  { number: "02", title: "Programma + offerte", text: "Wij stellen een voorstel op" },
  {
    number: "03",
    title: "Boeking",
    text: "Na akkoord dezelfde boekings- en betaalflow als een reguliere reis",
  },
];

export default function GroepenEnBedrijvenPage() {
  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="groepen" />

      <PageIntro
        eyebrow="Op maat"
        title="Niet alleen. Maar wel op maat."
        subtitle="Drie manieren om samen op reis: met je eigen groep, volledig op maat, of als bedrijf."
      />

      <div className={styles.propositions}>
        {PROPOSITIONS.map((prop) => (
          <div key={prop.title} className={styles.card}>
            {prop.icon}
            <h2 className={styles.cardTitle}>{prop.title}</h2>
            <p className={styles.cardText}>{prop.text}</p>
            <div className={styles.cardCtaWrap}>
              <a href={prop.href} className={styles.cardCta}>
                {prop.cta}
                <ArrowIcon size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.stepsSection}>
        <h2 className={styles.stepsTitle}>Hoe het werkt (voorbeeld: groepsreizen)</h2>
        <StepsGrid steps={STEPS} />
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
