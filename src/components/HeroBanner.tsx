import { SiteImage } from "./SiteImage";
import { HeroVideo } from "./HeroVideo";
import { getSiteSettings } from "@/lib/content/settings";
import { Nav } from "./Nav";
import { RichText } from "./RichText";
import styles from "./HeroBanner.module.css";

/** Full-bleed foto-hero bovenaan binnenpagina's: transparante nav over de
 * foto, eyebrow/titel/subtitel, optionele meta-regel, rode band eronder.
 * De sitebrede hero-video uit SiteSettings speelt over de paginafoto heen;
 * zonder video blijft de foto, zonder foto alleen de donkere achtergrond. */
export async function HeroBanner({
  active,
  height = 620,
  image,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  meta,
}: {
  active?: string;
  height?: number;
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta?: string[];
}) {
  const metaItems = meta?.filter(Boolean) ?? [];
  const { heroVideoUrl } = await getSiteSettings();
  return (
    <>
      <div className={styles.hero} style={{ ["--heroHeight" as string]: `${height}px` }}>
        <div className={styles.imageLayer}>
          <SiteImage src={image} alt={imageAlt} loading="eager" />
          <HeroVideo src={heroVideoUrl} poster={image} />
        </div>
        <div className={styles.gradient} />
        <Nav variant="transparent" active={active} />
        <div className={styles.content}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 className={styles.heading}>{title}</h1>
          {subtitle && <RichText html={subtitle} className={styles.subheading} />}
          {metaItems.length > 0 && (
            <div className={styles.metaRow}>
              {metaItems.map((item) => (
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
