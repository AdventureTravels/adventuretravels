import { existsSync } from "node:fs";
import path from "node:path";
import styles from "./VzrGarant.module.css";

export const VZR_GARANT_ACTIVE = process.env.VZR_GARANT_ACTIVE === "true";
const LOGO_PATH = "/vzr-garant.svg";
const hasLogo = existsSync(path.join(process.cwd(), "public", LOGO_PATH));

/** Alleen zichtbaar zodra de aansluiting rond is (VZR_GARANT_ACTIVE=true).
 * Toont het logo uit public/vzr-garant.svg, of een tekstbadge zolang dat
 * bestand ontbreekt. */
export function VzrGarant({ withText = true }: { withText?: boolean }) {
  if (!VZR_GARANT_ACTIVE) return null;
  return (
    <div className={styles.wrap}>
      {hasLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={LOGO_PATH} alt="VZR Garant" className={styles.logo} />
      ) : (
        <span className={styles.badge}>VZR Garant</span>
      )}
      {withText && (
        <p className={styles.text}>Je reissom is gedekt door VZR Garant, ook als wij onverhoopt failliet gaan.</p>
      )}
    </div>
  );
}
