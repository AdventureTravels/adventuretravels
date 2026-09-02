import { getReviews } from "@/lib/content/reviews";
import { RichText } from "./RichText";
import styles from "./Reviews.module.css";

/** Rendert niets zolang er geen reviews zijn. Geen gemiddelde en geen aantal
 * tot die uit echte, goedgekeurde reviews komen (Fase 6). */
export async function Reviews() {
  const reviews = await getReviews();
  if (reviews.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.eyebrow}>Reviews</span>
          <h2 className={styles.title}>Wat reizigers zeggen</h2>
        </div>
      </div>
      <div className={styles.grid}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.card}>
            <span className={styles.stars} aria-label={`${review.stars} van 5 sterren`}>
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
