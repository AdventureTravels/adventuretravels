import { notFound } from "next/navigation";
import { getReviewById } from "@/lib/content/reviews";
import { updateReviewAction } from "../actions";
import { ReviewForm } from "../ReviewForm";
import styles from "../../../admin.module.css";

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await getReviewById(id);
  if (!review) notFound();

  const action = updateReviewAction.bind(null, id);

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Review bewerken</h1>
      </div>
      <div className={styles.card}>
        <ReviewForm action={action} review={review} />
      </div>
    </div>
  );
}
