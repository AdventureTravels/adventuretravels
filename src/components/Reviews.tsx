import { getReviews } from "@/lib/content/reviews";
import { RichText } from "./RichText";
import styles from "./Reviews.module.css";

export async function Reviews() {
  const reviews = await getReviews();

  return (
    <div className={styles.section}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.eyebrow}>4,8 gemiddeld · 412 beoordelingen</span>
          <h2 className={styles.title}>Wat reizigers zeggen</h2>
        </div>
        <a href="/reizen" className={styles.viewAll}>
          Alle beoordelingen
        </a>
      </div>
      <div className={styles.grid}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.card}>
            <span className={styles.stars}>
              {"★".repeat(review.stars)}
              {"☆".repeat(5 - review.stars)}
            </span>
            <RichText html={review.quote} className={styles.quote} />
            <div className={styles.author}>{review.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
