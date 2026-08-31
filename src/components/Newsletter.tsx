import { ArrowIcon, SunMark } from "./icons";
import { getSiteSettings } from "@/lib/content/settings";
import styles from "./Newsletter.module.css";

export async function Newsletter() {
  const settings = await getSiteSettings();

  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <SunMark size={52} />
        <div className={styles.text}>
          <span className={styles.eyebrow}>Avondeditie · maandelijks</span>
          <div className={styles.title}>{settings.newsletterTitle}</div>
        </div>
      </div>
      <form className={styles.form}>
        <input
          type="email"
          required
          placeholder="jouw@email.nl"
          aria-label="E-mailadres"
          className={styles.emailField}
        />
        <button type="submit" className={styles.submit}>
          Aanmelden
          <ArrowIcon size={14} />
        </button>
      </form>
    </div>
  );
}
