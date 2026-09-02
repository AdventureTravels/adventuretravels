import Link from "next/link";
import { SiteImage, isImageUrl } from "./SiteImage";
import { ArrowIcon, SunMark } from "./icons";
import { getSiteSettings } from "@/lib/content/settings";
import styles from "./DayNight.module.css";

/** Dag/avond-blok op de homepage. Fotocellen verschijnen alleen als er in
 * /admin een foto is geüpload. */
export async function DayNight() {
  const settings = await getSiteSettings();

  return (
    <div className={styles.grid}>
      {isImageUrl(settings.dayImage) && (
        <div className={styles.photo}>
          <SiteImage src={settings.dayImage} alt="Ochtend op het water" />
          <span className={styles.photoLabel}>Dag</span>
        </div>
      )}

      <div className={`${styles.panel} ${styles.panelDark}`}>
        <SunMark size={74} />
        <h3 className={styles.heading}>Twee helften van dezelfde dag</h3>
        <p className={styles.body}>
          Vroeg op het water, vlak voordat de wind komt. Een gids die weet wanneer het park nog
          stil ligt. Tegen vijven ligt de uitrusting weg en begint het andere deel van de reis.
        </p>
        <Link href="/reizen" className={styles.ctaOutlineLight}>
          Bekijk de reizen
          <ArrowIcon size={14} />
        </Link>
      </div>

      <div id="verblijf" className={`${styles.panel} ${styles.panelLight}`}>
        <span className={styles.eyebrowLight}>Avond</span>
        <h3 className={styles.heading}>De tafel staat al gedekt</h3>
        <p className={styles.body}>
          Geen buffet, geen programma. Eén lange tafel in het dorp, gerechten uit de streek, en de
          ruimte om na te praten over wat er die dag misging en lukte.
        </p>
        <Link href="/verblijf" className={styles.ctaOutlineDark}>
          Over onze verblijven
          <ArrowIcon size={14} />
        </Link>
      </div>

      {isImageUrl(settings.eveningImage) && (
        <div className={styles.photo}>
          <SiteImage src={settings.eveningImage} alt="Avond aan tafel" />
          <span className={styles.photoLabel}>Avond</span>
        </div>
      )}
    </div>
  );
}
