import type { ReactNode } from "react";
import { CategoryCard } from "./CategoryCard";
import styles from "./CategoryStrip.module.css";

export type CategoryStripItem = {
  key: string;
  href: string;
  image: string;
  imageAlt: string;
  icon: ReactNode;
  name: string;
  caption: string;
  subLabel?: string;
};

/** Rij categoriekaarten (sporten of bestemmingen) op de homepage.
 * Zonder items rendert het blok niet. */
export function CategoryStrip({
  title,
  note,
  ctaLabel,
  items,
}: {
  title: string;
  note?: string;
  ctaLabel: string;
  items: CategoryStripItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {note && <span className={styles.note}>{note}</span>}
      </div>
      <div className={styles.grid}>
        {items.map((item) => (
          <CategoryCard
            key={item.key}
            href={item.href}
            image={item.image}
            imageAlt={item.imageAlt}
            icon={item.icon}
            name={item.name}
            subLabel={item.subLabel}
            caption={item.caption}
            ctaLabel={ctaLabel}
          />
        ))}
      </div>
    </section>
  );
}
