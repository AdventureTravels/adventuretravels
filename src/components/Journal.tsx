"use client";

import { SliderControls } from "./SliderControls";
import { useSlider } from "./useSlider";
import styles from "./Journal.module.css";

export type JournalTeaser = {
  href: string;
  tag: string;
  title: string;
  text: string;
};

/** Journal-teasers op de homepage. Alleen wat er is; niets zonder artikelen. */
export function Journal({ articles }: { articles: JournalTeaser[] }) {
  const { ref, onScroll, prev, next } = useSlider();
  if (articles.length === 0) return null;

  return (
    <div id="journal" className={styles.section}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.eyebrow}>Journal</span>
          <h2 className={styles.title}>Uit het veld</h2>
        </div>
        {articles.length > 1 && <SliderControls onPrev={prev} onNext={next} />}
      </div>

      <div ref={ref} onScroll={onScroll} className={styles.track}>
        {articles.map((article) => (
          <a key={article.href} href={article.href} className={styles.card}>
            <span className={styles.tag}>{article.tag}</span>
            <div className={styles.cardTitle}>{article.title}</div>
            <p className={styles.cardText}>{article.text}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
