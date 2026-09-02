import Link from "next/link";
import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { PageIntro } from "@/components/PageIntro";
import { ArrowIcon, CompassIcon, CheckCircleIcon, HouseIcon, SunMark } from "@/components/icons";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Verblijf — AdventureTravels",
  description: "Zelf getest, of we boeken het niet.",
};

export default function VerblijfPage() {
  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" active="verblijf" />

      <PageIntro
        eyebrow="Het concept"
        title="Zelf getest, of we boeken het niet."
        subtitle="Elke accommodatie in dit aanbod hebben we zelf bezocht en beoordeeld — niet uit een catalogus geselecteerd."
      />

      <div className={styles.features}>
        <div className={styles.feature}>
          <CompassIcon size={30} color="#23261F" strokeWidth={1.8} />
          <h2 className={styles.featureTitle}>Het concept</h2>
          <p className={styles.featureText}>
            Sport is het doel van de dag, comfort de reden om te blijven. Een keuken die het
            lokale werk kent, en een terras waar de dag wordt nagepraat.
          </p>
        </div>
        <div className={styles.feature}>
          <CheckCircleIcon size={30} color="#23261F" strokeWidth={2.4} />
          <h2 className={styles.featureTitle}>Wat &apos;zelf getest&apos; betekent</h2>
          <p className={styles.featureText}>
            Persoonlijk bezoek voorafgaand aan opname in het aanbod, een vast aanspreekpunt,
            herbeoordeling elk seizoen.
          </p>
        </div>
        <div className={styles.feature}>
          <HouseIcon size={30} color="#23261F" strokeWidth={1.8} door />
          <h2 className={styles.featureTitle}>Type verblijf</h2>
          <p className={styles.featureText}>
            Parkaccommodaties bij cable parks, per bestemming afgestemd op de sport.
          </p>
        </div>
      </div>

      <div className={styles.ctaBanner}>
        <div className={styles.ctaLeft}>
          <SunMark size={58} />
          <div className={styles.ctaHeading}>Bekijk welke reis bij dit verblijf hoort.</div>
        </div>
        <Link href="/reizen" className={styles.ctaButton}>
          Bekijk reizen
          <ArrowIcon size={14} />
        </Link>
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
