import Link from "next/link";
import { getReviews } from "@/lib/content/reviews";
import { deleteReviewAction } from "./actions";
import styles from "../../admin.module.css";

export default async function AdminReviewsPage() {
  const reviews = await getReviews();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Reviews</h1>
          <p className={styles.pageSubtitle}>De reviews op de homepage.</p>
        </div>
        <Link href="/admin/reviews/new" className={styles.button}>
          Nieuwe review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className={styles.empty}>Nog geen reviews.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sterren</th>
              <th>Auteur</th>
              <th>Quote</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{"★".repeat(review.stars)}</td>
                <td>{review.author}</td>
                <td style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {review.quote}
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/reviews/${review.id}`} className={styles.rowLink}>
                      Bewerken
                    </Link>
                    <form action={deleteReviewAction.bind(null, review.id)}>
                      <button type="submit" className={styles.rowLink} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        Verwijderen
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
