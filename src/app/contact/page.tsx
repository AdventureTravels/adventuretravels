import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { PageIntro } from "@/components/PageIntro";
import { Placeholder } from "@/components/Placeholder";
import { PhoneIcon, MailIcon, ClockIcon } from "@/components/icons";
import { ContactForm } from "./ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact — AdventureTravels",
  description: "Praat met iemand die zelf ook wakeboardt.",
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" />

      <PageIntro eyebrow="Contact" title="Praat met iemand die zelf ook wakeboardt." />

      <div className={styles.layout}>
        <ContactForm />

        <div className={styles.infoCol}>
          <div className={styles.infoRow}>
            <PhoneIcon size={24} color="#C7513C" strokeWidth={2.2} />
            <div>
              <div className={styles.infoLabel}>Telefoon</div>
              <div className={styles.infoValue}>+31 20 244 18 60</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <MailIcon size={24} color="#C7513C" strokeWidth={2.2} />
            <div>
              <div className={styles.infoLabel}>E-mail</div>
              <div className={styles.infoValue}>hallo@adventuretravels.nl</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <ClockIcon size={24} color="#C7513C" strokeWidth={2.2} />
            <div>
              <div className={styles.infoLabel}>Reactietijd</div>
              <div className={styles.infoValue}>We reageren binnen 1 werkdag.</div>
            </div>
          </div>
          <div className={styles.infoPhoto}>
            <Placeholder label="Op het water" />
          </div>
        </div>
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
