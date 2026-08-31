import { createFaqItemAction } from "../actions";
import { FaqItemForm } from "../FaqItemForm";
import styles from "../../../admin.module.css";

export default function NewFaqItemPage() {
  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nieuwe vraag</h1>
      </div>
      <div className={styles.card}>
        <FaqItemForm action={createFaqItemAction} />
      </div>
    </div>
  );
}
