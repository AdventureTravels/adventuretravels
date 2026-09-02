import { CheckCircleIcon } from "./icons";
import { getSiteSettings } from "@/lib/content/settings";
import styles from "./TrustStrip.module.css";

/** Feitelijke USP's uit SiteSettings, zonder getallen. Rendert niets als er
 * geen USP's zijn ingevuld. */
export async function TrustStrip() {
  const settings = await getSiteSettings();
  const usps = settings.usps.filter(Boolean);
  if (usps.length === 0) return null;

  return (
    <div className={styles.strip}>
      {usps.map((usp) => (
        <div key={usp} className={styles.item}>
          <CheckCircleIcon size={20} color="#C7513C" strokeWidth={2.4} />
          <span className={styles.label}>{usp}</span>
        </div>
      ))}
    </div>
  );
}
