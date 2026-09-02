import Link from "next/link";
import { AtMark } from "./icons";
import { getSiteSettings } from "@/lib/content/settings";
import { getSports } from "@/lib/content/sports";
import { getDestinations } from "@/lib/content/destinations";
import styles from "./Footer.module.css";

const COMPANY = [
  { label: "Over ons", href: "/over-ons" },
  { label: "Vertrouwen & zekerheid", href: "/vertrouwen" },
  { label: "Journal", href: "/journal" },
  { label: "Veelgestelde vragen", href: "/faq" },
];

/** Het VZR Garant-logo mag pas mee zodra de aansluiting rond is. */
export const VZR_GARANT_ACTIVE = process.env.VZR_GARANT_ACTIVE === "true";

export async function Footer() {
  const [settings, sports, destinations] = await Promise.all([getSiteSettings(), getSports(), getDestinations()]);

  return (
    <div id="bestemmingen" className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandCol}>
          <AtMark size={36} color="#23261F" />
          <div className={styles.wordmark}>ADVENTURETRAVELS</div>
          <p className={styles.tagline}>{settings.footerTagline}</p>
          {VZR_GARANT_ACTIVE && (
            <div className={styles.badges}>
              <span>VZR Garant</span>
            </div>
          )}
        </div>

        {sports.length > 0 && (
          <div className={styles.linkCol}>
            <span className={styles.linkColHeading}>Sporten</span>
            {sports.map((s) => (
              <Link key={s.id} href={`/sporten/${s.slug}`}>
                {s.name}
              </Link>
            ))}
          </div>
        )}

        {destinations.length > 0 && (
          <div className={styles.linkCol}>
            <span className={styles.linkColHeading}>Bestemmingen</span>
            {destinations.map((d) => (
              <Link key={d.id} href={`/bestemmingen/${d.slug}`}>
                {d.name}
              </Link>
            ))}
          </div>
        )}

        <div className={styles.linkCol}>
          <span className={styles.linkColHeading}>Bedrijf</span>
          {COMPANY.map((c) => (
            <Link key={c.label} href={c.href}>
              {c.label}
            </Link>
          ))}
        </div>

        <div className={styles.linkCol}>
          <span className={styles.linkColHeading}>Contact</span>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
          <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
          <Link href="/contact">Contactformulier</Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} AdventureTravels</span>
        <div className={styles.bottomLinks}>
          <Link href="/voorwaarden">Voorwaarden</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/annuleringsvoorwaarden">Annuleringsvoorwaarden</Link>
        </div>
      </div>
    </div>
  );
}
