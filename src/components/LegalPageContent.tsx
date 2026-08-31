import type { Page } from "@prisma/client";
import type { PageSection } from "@/lib/content/pages";
import { ClockIcon, MailIcon, DocumentIcon, LockIcon } from "@/components/icons";
import { RichText } from "@/components/RichText";
import styles from "@/styles/legalPage.module.css";

type StatDatum = { value: string; label: string };
type TableRow = { moment: string; cost: string; free?: boolean; note: string };

const ICON_LOOKUP: Record<string, typeof MailIcon> = {
  Contactformulier: MailIcon,
  Nieuwsbrief: DocumentIcon,
  Boekingsgegevens: LockIcon,
};

export function LegalPageContent({ page }: { page: Page }) {
  const sections = page.sections as unknown as PageSection[];
  const extra = (page.extra ?? {}) as { versionNote?: string };

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <span className={styles.eyebrow}>{page.eyebrow}</span>
        <h1 className={styles.heading}>{page.title}</h1>
        <RichText html={page.subtitle} className={styles.subheading} />
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <span className={styles.sidebarLabel}>Op deze pagina</span>
          <div className={styles.tocList}>
            {sections.map((section, i) => (
              <span
                key={section.title}
                className={i === 0 ? `${styles.tocItem} ${styles.tocItemActive}` : styles.tocItem}
              >
                {section.title}
              </span>
            ))}
          </div>
          <div className={styles.sidebarContact}>
            <span className={styles.sidebarContactLabel}>Vragen</span>
            <span>hallo@adventuretravels.nl</span>
            <span>+31 20 244 18 60</span>
          </div>
        </div>

        <div className={styles.content}>
          {sections.map((section) => (
            <div key={section.title} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <RichText html={section.bodyHtml} className={styles.sectionText} />

              {section.kind === "stats" && (
                <div
                  className={styles.statGrid}
                  style={{ gridTemplateColumns: `repeat(${(section.data as StatDatum[]).length}, 1fr)` }}
                >
                  {(section.data as StatDatum[]).map((stat) => (
                    <div key={stat.label} className={styles.statCell}>
                      <div className={styles.statValue}>{stat.value}</div>
                      <div className={styles.statLabel}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {section.kind === "icons" && (
                <div className={styles.iconGrid}>
                  {(section.data as string[]).map((label) => {
                    const Icon = ICON_LOOKUP[label] ?? DocumentIcon;
                    return (
                      <div key={label} className={styles.iconCell}>
                        <Icon size={24} color="#23261F" strokeWidth={1.8} />
                        <span className={styles.iconCellLabel}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {section.kind === "table" && (
                <div className={styles.table}>
                  <div className={styles.tableHead}>
                    <span>Moment van annuleren</span>
                    <span>Kosten</span>
                    <span>Toelichting</span>
                  </div>
                  {(section.data as TableRow[]).map((row) => (
                    <div key={row.moment} className={styles.tableRow}>
                      <span className={styles.tableLabel}>{row.moment}</span>
                      <span className={row.free ? styles.tableValueFree : styles.tableValue}>{row.cost}</span>
                      <span className={styles.tableNote}>{row.note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {extra.versionNote && (
            <div className={styles.versionNote}>
              <ClockIcon size={22} color="#C7513C" strokeWidth={1.8} />
              <span>{extra.versionNote}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
