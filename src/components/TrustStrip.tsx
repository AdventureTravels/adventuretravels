import { getSiteSettings } from "@/lib/content/settings";
import type { TrustStat } from "@/lib/content/settings";
import styles from "./TrustStrip.module.css";

export async function TrustStrip() {
  const settings = await getSiteSettings();
  const stats = settings.trustStats as unknown as TrustStat[];

  return (
    <div className={styles.strip}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.item}>
          <span className={styles.value}>{stat.value}</span>
          <span className={styles.label}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
