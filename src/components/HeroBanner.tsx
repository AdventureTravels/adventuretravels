import { Placeholder } from "./Placeholder";
import { Nav } from "./Nav";
import { RichText } from "./RichText";
import styles from "./HeroBanner.module.css";

/** Full-bleed photo hero used at the top of inner pages: transparent nav
 * over the image, eyebrow/title/subtitle, optional meta row, red band below. */
export function HeroBanner({
  active,
  height = 620,
  imageLabel,
  eyebrow,
  title,
  subtitle,
  meta,
}: {
  active?: string;
  height?: number;
  imageLabel: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta?: string[];
}) {
  return (
    <>
      <div className={styles.hero} style={{ ["--heroHeight" as string]: `${height}px` }}>
        <div className={styles.imageLayer}>
          <Placeholder label={imageLabel} />
        </div>
        <div className={styles.gradient} />
        <Nav variant="transparent" active={active} />
        <div className={styles.content}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 className={styles.heading}>{title}</h1>
          {subtitle && <RichText html={subtitle} className={styles.subheading} />}
          {meta && (
            <div className={styles.metaRow}>
              {meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.redBand} />
    </>
  );
}
