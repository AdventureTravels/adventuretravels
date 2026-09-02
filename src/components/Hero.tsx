import Link from "next/link";
import { Fragment } from "react";
import { SiteImage } from "./SiteImage";
import { Nav } from "./Nav";
import { RichText } from "./RichText";
import { TripSlider } from "./TripSlider";
import type { Trip as TripCardData } from "./TripCard";
import { getSiteSettings } from "@/lib/content/settings";
import styles from "./Hero.module.css";

/** Homepage-hero: copy uit SiteSettings, daaronder een slider met álle
 * gepubliceerde reizen. Geen zoekveld, filters of tellingen. */
export async function Hero({ trips }: { trips: TripCardData[] }) {
  const settings = await getSiteSettings();
  const headingLines = settings.heroHeading.split("\n");

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.imageLayer}>
          <SiteImage src={settings.heroImage} alt="" loading="eager" />
        </div>
        <div className={styles.gradient} />

        <Nav variant="transparent" />

        <div className={styles.content}>
          {settings.heroEyebrow && <span className={styles.eyebrow}>{settings.heroEyebrow}</span>}
          <h1 className={styles.heading}>
            {headingLines.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>
          <RichText html={settings.heroSubheading} className={styles.subheading} />
        </div>
      </section>

      {trips.length > 0 && (
        <div className={styles.sliderWrap}>
          <div className={styles.sliderCard}>
            <div className={styles.sliderHead}>
              <div className={styles.sliderTitle}>Onze reizen</div>
              <Link href="/reizen" className={styles.sliderLink}>
                Alle reizen
              </Link>
            </div>
            <TripSlider trips={trips} />
          </div>
        </div>
      )}
      <div className={styles.redBand} />
    </>
  );
}
