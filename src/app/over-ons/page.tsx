import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { SiteImage, isImageUrl } from "@/components/SiteImage";
import { RichText } from "@/components/RichText";
import { ArrowIcon } from "@/components/icons";
import { getPageBySlug } from "@/lib/content/pages";
import type { PageSection } from "@/lib/content/pages";
import { stripHtml } from "@/lib/stripHtml";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("over-ons");
  if (!page) return {};
  return { title: `${page.title} — AdventureTravels`, description: stripHtml(page.subtitle) };
}

export default async function OverOnsPage() {
  const page = await getPageBySlug("over-ons");
  if (!page) notFound();

  const sections = page.sections as unknown as PageSection[];
  const sub = sections[0];
  const extra = (page.extra ?? {}) as {
    portraitName?: string;
    portraitRole?: string;
    portraitImage?: string;
  };

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" />

      <div className={styles.grid}>
        <div className={styles.text}>
          <span className={styles.eyebrow}>{page.eyebrow}</span>
          <h1 className={styles.heading}>{page.title}</h1>
          <RichText html={page.subtitle} className={styles.body} />
          {sub && (
            <div className={styles.sub}>
              <h2 className={styles.subTitle}>{sub.title}</h2>
              <RichText html={sub.bodyHtml} className={styles.subText} />
            </div>
          )}
          <div className={styles.ctaWrap}>
            <a href="/vertrouwen" className={styles.cta}>
              Bekijk onze zekerheid
              <ArrowIcon size={14} />
            </a>
          </div>
        </div>
        {isImageUrl(extra.portraitImage) && (
          <div className={styles.portrait}>
            <SiteImage src={extra.portraitImage} alt={extra.portraitName ?? "Portret"} />
            <div className={styles.portraitGradient} />
            <div className={styles.portraitCaption}>
              <span className={styles.portraitName}>{extra.portraitName}</span>
              <span className={styles.portraitRole}>{extra.portraitRole}</span>
            </div>
          </div>
        )}
      </div>

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
