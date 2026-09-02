import { CheckCircleIcon } from "./icons";
import { getSiteSettings } from "@/lib/content/settings";
import styles from "./TrustStripSimple.module.css";

/** Dezelfde USP's als op de homepage, in de compacte variant boven de footer.
 * Rendert niets als er geen USP's zijn ingevuld. */
export async function TrustStripSimple() {
  const settings = await getSiteSettings();
  const usps = settings.usps.filter(Boolean);
  if (usps.length === 0) return null;

  return (
    <div className={styles.strip}>
      {usps.map((item) => (
        <div key={item} className={styles.item}>
          <CheckCircleIcon size={20} color="#C7513C" strokeWidth={2.4} />
          <span className={styles.label}>{item}</span>
        </div>
      ))}
    </div>
  );
}
