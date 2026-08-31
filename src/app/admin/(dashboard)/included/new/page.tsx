import { createIncludedItemAction } from "../actions";
import { IncludedItemForm } from "../IncludedItemForm";
import styles from "../../../admin.module.css";

export default function NewIncludedItemPage() {
  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nieuw item</h1>
      </div>
      <div className={styles.card}>
        <IncludedItemForm action={createIncludedItemAction} />
      </div>
    </div>
  );
}
