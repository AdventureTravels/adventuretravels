import { createPartnerAction } from "../actions";
import { PartnerForm } from "../PartnerForm";
import styles from "../../../admin.module.css";

export default function NewPartnerPage() {
  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nieuwe partner</h1>
      </div>
      <div className={styles.card} style={{ marginTop: 16 }}>
        <PartnerForm action={createPartnerAction} />
      </div>
    </div>
  );
}
