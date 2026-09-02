import { getAllReviews } from "@/lib/content/reviews";
import { formatDateShort } from "@/lib/format";
import { setReviewStatusAction, deleteReviewAction } from "./actions";
import styles from "../../admin.module.css";

const STATUS: Record<string, string> = { pending: "Wacht op beoordeling", approved: "Goedgekeurd", rejected: "Afgewezen" };

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Reviews</h1>
          <p className={styles.pageSubtitle}>Reviews komen alleen binnen via de reviewmail na een reis. Alleen goedgekeurde reviews staan op de site.</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className={styles.empty}>Nog geen reviews.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Reis</th>
              <th>Boeking</th>
              <th>Score</th>
              <th>Naam</th>
              <th>Tekst</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{formatDateShort(review.createdAt)}</td>
                <td>{review.trip.title}</td>
                <td>{review.booking.bookingNumber}</td>
                <td>{"★".repeat(review.rating)}</td>
                <td>{review.reviewerName}{review.reviewerPlace ? `, ${review.reviewerPlace}` : ""}</td>
                <td style={{ maxWidth: 320 }}>{review.text}</td>
                <td>{STATUS[review.status] ?? review.status}</td>
                <td>
                  <div className={styles.rowActions}>
                    {review.status !== "approved" && (
                      <form action={setReviewStatusAction.bind(null, review.id, "approved")}>
                        <button type="submit" className={styles.rowLink} style={{ background: "none", border: "none", cursor: "pointer" }}>Goedkeuren</button>
                      </form>
                    )}
                    {review.status !== "rejected" && (
                      <form action={setReviewStatusAction.bind(null, review.id, "rejected")}>
                        <button type="submit" className={styles.rowLink} style={{ background: "none", border: "none", cursor: "pointer" }}>Afwijzen</button>
                      </form>
                    )}
                    <form action={deleteReviewAction.bind(null, review.id)}>
                      <button type="submit" className={styles.rowLink} style={{ background: "none", border: "none", cursor: "pointer" }}>Verwijderen</button>
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
