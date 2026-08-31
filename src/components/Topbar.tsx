import { getSiteSettings } from "@/lib/content/settings";
import styles from "./Topbar.module.css";

export async function Topbar() {
  const settings = await getSiteSettings();
  return (
    <div className={styles.topbar}>
      <span>{settings.topbarTagline}</span>
      <div className={styles.right}>
        <span>NL / EN</span>
        <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>Spreek een gids · {settings.phone}</a>
      </div>
    </div>
  );
}
