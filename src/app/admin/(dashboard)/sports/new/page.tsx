import { createSportAction } from "../actions";
import { SportForm } from "../SportForm";
import styles from "../../../admin.module.css";

export default function NewSportPage() {
  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nieuwe sport</h1>
      </div>
      <div className={styles.card}>
        <SportForm action={createSportAction} />
      </div>
    </div>
  );
}
