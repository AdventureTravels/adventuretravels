import { CheckCircleIcon, SunMark } from "./icons";
import { getSiteSettings } from "@/lib/content/settings";
import styles from "./RequestForm.module.css";

export async function RequestSidebar() {
  const settings = await getSiteSettings();
  return (
    <div className={styles.sidebar}>
      <div className={styles.callCard}>
        <SunMark size={54} />
        <div className={styles.callTitle}>Liever eerst even bellen?</div>
        <p className={styles.callText}>
          <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>Spreek een gids · {settings.phone}</a>
        </p>
      </div>
      <div className={styles.afterCard}>
        <span className={styles.afterLabel}>Na je aanvraag</span>
        <div className={styles.afterList}>
          {["Voorstel met programma en prijs", "Dezelfde boekings- en betaalflow als een reguliere reis"].map((item) => (
            <div key={item} className={styles.afterItem}>
              <CheckCircleIcon size={18} color="#C7513C" strokeWidth={2.4} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
