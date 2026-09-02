import { getSiteSettings } from "@/lib/content/settings";
import { isImageUrl } from "./SiteImage";
import { RichText } from "./RichText";
import { ProgramCtaForm } from "./ProgramCtaForm";
import { turnstileSiteKey } from "@/lib/turnstile";
import styles from "./ProgramCta.module.css";

const STEPS = [
  { number: "01", title: "Dag voor dag, per reis", body: "Van vertrektijd op het water tot het adres waar je die avond eet." },
  { number: "02", title: "Niveau en conditie", body: "Per dag wat je moet kunnen en hoeveel tijd je op het water staat." },
  { number: "03", title: "Volledige prijsopbouw", body: "Wat inbegrepen is, wat optioneel is en wat je ter plaatse betaalt." },
];

/** Programma-pdf aanvragen. Rendert niets zolang er geen pdf is geüpload. */
export async function ProgramCta() {
  const settings = await getSiteSettings();
  if (!isImageUrl(settings.programPdfUrl)) return null;

  return (
    <div id="programma" className={styles.section}>
      <div className={styles.left}>
        <span className={styles.eyebrow}>{settings.programCtaEyebrow}</span>
        <h2 className={styles.title}>{settings.programCtaTitle}</h2>
        <RichText html={settings.programCtaBody} className={styles.body} />
        <ProgramCtaForm siteKey={turnstileSiteKey()} />
      </div>
      <div className={styles.right}>
        {STEPS.map((step) => (
          <div key={step.number} className={styles.step}>
            <span className={styles.stepNumber}>{step.number}</span>
            <div>
              <div className={styles.stepTitle}>{step.title}</div>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
