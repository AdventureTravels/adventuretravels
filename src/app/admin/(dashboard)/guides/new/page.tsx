import { createGuideAction } from "../actions";
import { GuideForm } from "../GuideForm";
import styles from "../../../admin.module.css";

export default function NewGuidePage() {
  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Nieuwe gids</h1>
      </div>
      <div className={styles.card} style={{ marginTop: 16 }}>
        <GuideForm action={createGuideAction} />
      </div>
    </div>
  );
}
