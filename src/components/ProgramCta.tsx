import { ArrowIcon } from "./icons";
import { getSiteSettings } from "@/lib/content/settings";
import { RichText } from "./RichText";
import styles from "./ProgramCta.module.css";

const STEPS = [
  {
    number: "01",
    title: "Dag voor dag, per reis",
    body: "Van vertrektijd op het water tot het adres waar je die avond eet.",
  },
  {
    number: "02",
    title: "Niveau en conditie",
    body: "Per dag hoogtemeters, afstand en wat je moet kunnen.",
  },
  {
    number: "03",
    title: "Volledige prijsopbouw",
    body: "Wat inbegrepen is, wat optioneel is en wat je ter plaatse betaalt.",
  },
];

export async function ProgramCta() {
  const settings = await getSiteSettings();

  return (
    <div id="programma" className={styles.section}>
      <div className={styles.left}>
        <span className={styles.eyebrow}>{settings.programCtaEyebrow}</span>
        <h2 className={styles.title}>{settings.programCtaTitle}</h2>
        <RichText html={settings.programCtaBody} className={styles.body} />
        <form className={styles.formRow}>
          <input
            type="email"
            required
            placeholder="jouw@email.nl"
            aria-label="E-mailadres"
            className={styles.emailField}
          />
          <button type="submit" className={styles.submit}>
            Stuur de pdf
            <ArrowIcon size={14} />
          </button>
        </form>
        <div className={styles.fineprint}>
          Geen nieuwsbrief tenzij je dat aanvinkt · afmelden in één klik
        </div>
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
