import Link from "next/link";
import { AtMark } from "./icons";
import { getSiteSettings } from "@/lib/content/settings";
import styles from "./Footer.module.css";

const SPORTS = [
  { label: "Watersport", href: "/sporten" },
  { label: "Mountainbike", href: "/sporten" },
  { label: "Bergsport", href: "/sporten" },
  { label: "Wakeboarden", href: "/sporten/wakeboarden" },
];

const DESTINATIONS = [
  { label: "Italië", href: "/bestemmingen" },
  { label: "Slovenië", href: "/bestemmingen" },
  { label: "Spanje", href: "/bestemmingen" },
  { label: "Oostenrijk", href: "/bestemmingen" },
];

const COMPANY = [
  { label: "Over ons", href: "/over-ons" },
  { label: "Vertrouwen & zekerheid", href: "/vertrouwen" },
  { label: "Journal", href: "/journal" },
  { label: "Veelgestelde vragen", href: "/faq" },
];

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <div id="bestemmingen" className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandCol}>
          <AtMark size={36} color="#23261F" />
          <div className={styles.wordmark}>ADVENTURETRAVELS</div>
          <p className={styles.tagline}>{settings.footerTagline}</p>
          <div className={styles.badges}>
            <span>SGR</span>
            <span>Calamiteitenfonds</span>
            <span>ANVR</span>
          </div>
        </div>

        <div className={styles.linkCol}>
          <span className={styles.linkColHeading}>Sporten</span>
          {SPORTS.map((s) => (
            <Link key={s.label} href={s.href}>
              {s.label}
            </Link>
          ))}
        </div>

        <div className={styles.linkCol}>
          <span className={styles.linkColHeading}>Bestemmingen</span>
          {DESTINATIONS.map((d) => (
            <Link key={d.label} href={d.href}>
              {d.label}
            </Link>
          ))}
        </div>

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
          <span>Instagram</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© 2026 AdventureTravels</span>
        <div className={styles.bottomLinks}>
          <Link href="/voorwaarden">Voorwaarden</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/annuleringsvoorwaarden">Annuleringsvoorwaarden</Link>
        </div>
      </div>
    </div>
  );
}
