import { getApprovedReviews, averageRating } from "@/lib/content/reviews";
import styles from "./Reviews.module.css";

/** Goedgekeurde reviews. Rendert niets zonder reviews; een gemiddelde pas
 * vanaf 10 reviews. */
export async function Reviews({ tripId }: { tripId?: string } = {}) {
  const reviews = await getApprovedReviews(tripId);
  if (reviews.length === 0) return null;
  const average = averageRating(reviews);

  return (
    <div className={styles.section}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.eyebrow}>
            {average !== null ? `${average.toLocaleString("nl-NL")} gemiddeld · ${reviews.length} reviews` : "Reviews"}
          </span>
          <h2 className={styles.title}>Wat reizigers zeggen</h2>
        </div>
      </div>
      <div className={styles.grid}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.card}>
            <span className={styles.stars} aria-label={`${review.rating} van 5 sterren`}>
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </span>
            <p className={styles.quote}>{review.text}</p>
            <div className={styles.author}>
              {review.reviewerName}
              {review.reviewerPlace ? `, ${review.reviewerPlace}` : ""} · {review.trip.title}, {review.travelMonth}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
