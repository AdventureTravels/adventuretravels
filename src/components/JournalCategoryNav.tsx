import Link from "next/link";
import styles from "./JournalCategoryNav.module.css";

export type JournalCategoryLink = { slug: string; name: string; count: number };

/** Categorienavigatie van het journal: echte links, geen JS-filters. Lege categorieën worden niet getoond. */
export function JournalCategoryNav({ categories, activeSlug }: { categories: JournalCategoryLink[]; activeSlug?: string }) {
  const visible = categories.filter((c) => c.count > 0);
  if (visible.length === 0) return null;
  return (
    <nav className={styles.nav} aria-label="Categorieën">
      <Link href="/journal" className={activeSlug ? styles.chip : `${styles.chip} ${styles.chipActive}`}>
        Alles
      </Link>
      {visible.map((c) => (
        <Link key={c.slug} href={`/journal/categorie/${c.slug}`} className={c.slug === activeSlug ? `${styles.chip} ${styles.chipActive}` : styles.chip}>
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
