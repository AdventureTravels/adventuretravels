import { Placeholder } from "./Placeholder";
import { ArrowIcon, SunMark } from "./icons";
import styles from "./DayNight.module.css";

export function DayNight() {
  return (
    <div className={styles.grid}>
      <div className={styles.photo}>
        <Placeholder label="Dag — vertrek bij dageraad" />
        <span className={styles.photoLabel}>06:40 — Dag</span>
      </div>

      <div className={`${styles.panel} ${styles.panelDark}`}>
        <SunMark size={74} />
        <h3 className={styles.heading}>Twee helften van dezelfde dag</h3>
        <p className={styles.body}>
          Vroeg op het water, vlak voordat de wind komt. Een gids die weet welke kant van het meer
          om acht uur nog stil ligt. Tegen vijven ligt de uitrusting weg en begint het andere deel
          van de reis.
        </p>
        <a href="#programma" className={styles.ctaOutlineLight}>
          Zo ziet een dag eruit
          <ArrowIcon size={14} />
        </a>
      </div>

      <div id="verblijf" className={`${styles.panel} ${styles.panelLight}`}>
        <span className={styles.eyebrowLight}>20:15 — Avond</span>
        <h3 className={styles.heading}>De tafel staat al gedekt</h3>
        <p className={styles.body}>
          Geen buffet, geen programma. Eén lange tafel in het dorp, gerechten uit de streek, en de
          ruimte om na te praten over wat er die dag misging en lukte.
        </p>
        <a href="/verblijf" className={styles.ctaOutlineDark}>
          Over onze verblijven
          <ArrowIcon size={14} />
        </a>
      </div>

      <div className={styles.photo}>
        <Placeholder label="Avond — tafel onder de olijfbomen" />
      </div>
    </div>
  );
}
