import { Fragment } from "react";
import { Placeholder } from "./Placeholder";
import { Nav } from "./Nav";
import { ArrowIcon, WaveIcon, PinIcon, CalendarIcon, LevelIcon, ChevronDownIcon } from "./icons";
import { getSiteSettings } from "@/lib/content/settings";
import { RichText } from "./RichText";
import styles from "./Hero.module.css";

const QUICK_FILTERS = [
  { label: "Wakeboarden", href: "/reizen?sport=wakeboarden" },
  { label: "Mountainbike", href: "/reizen?sport=mountainbike" },
  { label: "Klimmen", href: "/reizen?sport=klimmen" },
  { label: "Mei", href: "/reizen?period=mei" },
  { label: "Beginners welkom", href: "/reizen?level=beginner" },
];

const FIELDS = [
  { label: "Sport", value: "Alle sporten", icon: <WaveIcon size={18} color="#23261F" /> },
  { label: "Bestemming", value: "Europa", icon: <PinIcon size={18} color="#23261F" /> },
  { label: "Wanneer", value: "Mei — september", icon: <CalendarIcon size={18} color="#23261F" /> },
  { label: "Niveau", value: "Elk niveau", icon: <LevelIcon size={18} color="#23261F" /> },
];

export async function Hero() {
  const settings = await getSiteSettings();
  const headingLines = settings.heroHeading.split("\n");

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.imageLayer}>
          <Placeholder label="Hero — wakeboarden bij zonsondergang" />
        </div>
        <div className={styles.gradient} />

        <Nav variant="transparent" />

        <div className={styles.content}>
          <span className={styles.eyebrow}>{settings.heroEyebrow}</span>
          <h1 className={styles.heading}>
            {headingLines.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>
          <RichText html={settings.heroSubheading} className={styles.subheading} />
          <div className={styles.ctaRow}>
            <a href="#programma" className={styles.secondaryCta}>
              Programma-pdf ontvangen
            </a>
          </div>
          <div className={styles.fineprint}>
            15% aanbetaling · kosteloos annuleren tot 45 dagen voor vertrek
          </div>
        </div>

        <div id="plan" className={styles.searchCard}>
          <div className={styles.searchHead}>
            <div className={styles.searchTitle}>Waar wil je heen?</div>
            <span className={styles.searchMeta}>24 reizen · 8 landen · maart tot oktober</span>
          </div>
          <div className={styles.fields}>
            {FIELDS.map((field, i) => (
              <div
                key={field.label}
                className={i === FIELDS.length - 1 ? `${styles.field} ${styles.fieldLast}` : styles.field}
              >
                <span className={styles.fieldLabel}>{field.label}</span>
                <div className={styles.fieldValueRow}>
                  <div className={styles.fieldValue}>
                    {field.icon}
                    <span>{field.value}</span>
                  </div>
                  <ChevronDownIcon />
                </div>
              </div>
            ))}
            <a href="/reizen" className={styles.searchSubmit}>
              Zoek 24 reizen
              <ArrowIcon size={15} />
            </a>
          </div>
          <div className={styles.quickFilters}>
            <span className={styles.quickFiltersLabel}>Populair</span>
            {QUICK_FILTERS.map((filter) => (
              <a key={filter.label} href={filter.href} className={styles.quickFilterChip}>
                {filter.label}
              </a>
            ))}
          </div>
        </div>
      </section>
      <div className={styles.redBand} />
    </>
  );
}
