"use client";

import { SliderControls } from "./SliderControls";
import { useSlider } from "./useSlider";
import { ComingSoonTile } from "./ComingSoonTile";
import styles from "./Journal.module.css";

export type JournalTeaser = {
  href: string;
  tag: string;
  title: string;
  text: string;
};

const SLOT_COUNT = 4;

export function Journal({ articles }: { articles: JournalTeaser[] }) {
  const { ref, onScroll, prev, next } = useSlider();
  const emptySlots = Math.max(0, SLOT_COUNT - articles.length);

  return (
    <div id="journal" className={styles.section}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.eyebrow}>Journal</span>
          <h2 className={styles.title}>Uit het veld</h2>
        </div>
        <SliderControls onPrev={prev} onNext={next} />
      </div>

      <div ref={ref} onScroll={onScroll} className={styles.track}>
        {articles.map((article) => (
          <a key={article.title} href={article.href} className={styles.card}>
            <span className={styles.tag}>{article.tag}</span>
            <div className={styles.cardTitle}>{article.title}</div>
            <p className={styles.cardText}>{article.text}</p>
          </a>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={i} className={styles.card}>
            <ComingSoonTile text="Meer artikelen volgen" />
          </div>
        ))}
      </div>
    </div>
  );
}
