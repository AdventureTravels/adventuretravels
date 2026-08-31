import { createReviewAction } from "../actions";
import { ReviewForm } from "../ReviewForm";
import styles from "../../../admin.module.css";

export default function NewReviewPage() {
  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nieuwe review</h1>
      </div>
      <div className={styles.card}>
        <ReviewForm action={createReviewAction} />
      </div>
    </div>
  );
}
