import { createTripTypeAction } from "../actions";
import { TripTypeForm } from "../TripTypeForm";
import styles from "../../../admin.module.css";

export default function NewTripTypePage() {
  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nieuwe tegel</h1>
      </div>
      <div className={styles.card}>
        <TripTypeForm action={createTripTypeAction} />
      </div>
    </div>
  );
}
