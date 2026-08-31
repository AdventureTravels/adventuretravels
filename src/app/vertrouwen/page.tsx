import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustStripSimple } from "@/components/TrustStripSimple";
import { PageIntro } from "@/components/PageIntro";
import { RichText } from "@/components/RichText";
import { ShieldIcon, DocumentIcon, BuildingIcon } from "@/components/icons";
import { getPageBySlug } from "@/lib/content/pages";
import type { PageSection } from "@/lib/content/pages";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("vertrouwen");
  if (!page) return {};
  return { title: `${page.title} — AdventureTravels`, description: page.title };
}

const CARD_ICONS = [ShieldIcon, DocumentIcon, BuildingIcon];

export default async function VertrouwenPage() {
  const page = await getPageBySlug("vertrouwen");
  if (!page) notFound();

  const sections = page.sections as unknown as PageSection[];
  const extra = (page.extra ?? {}) as { badges?: string[] };

  return (
    <div className={styles.page}>
      <Topbar />
      <Nav variant="solid" />

      <PageIntro eyebrow={page.eyebrow} title={page.title} />

      <div className={styles.grid}>
        {sections.map((section, i) => {
          const Icon = CARD_ICONS[i] ?? ShieldIcon;
          return (
            <div key={section.title} className={styles.card}>
              <Icon size={30} color="#23261F" strokeWidth={1.8} />
              <h2 className={styles.cardTitle}>{section.title}</h2>
              <RichText html={section.bodyHtml} className={styles.cardText} />
            </div>
          );
        })}
      </div>

      {extra.badges && (
        <div className={styles.badges}>
          {extra.badges.map((badge) => (
            <span key={badge} className={styles.badge}>
              {badge}
            </span>
          ))}
        </div>
      )}

      <TrustStripSimple />
      <Footer />
    </div>
  );
}
