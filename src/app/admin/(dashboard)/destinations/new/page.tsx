import { createDestinationAction } from "../actions";
import { DestinationForm } from "../DestinationForm";
import styles from "../../../admin.module.css";

export default function NewDestinationPage() {
  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nieuwe bestemming</h1>
      </div>
      <div className={styles.card}>
        <DestinationForm action={createDestinationAction} />
      </div>
    </div>
  );
}
