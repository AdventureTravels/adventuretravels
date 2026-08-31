import type { Review } from "@prisma/client";
import { RichTextEditor } from "../../RichTextEditor";
import styles from "../../admin.module.css";

export function ReviewForm({ action, review }: { action: (formData: FormData) => void; review?: Review }) {
  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="stars">Sterren (1-5)</label>
          <input className={styles.input} id="stars" name="stars" type="number" min={1} max={5} defaultValue={review?.stars ?? 5} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="author">Auteur</label>
          <input className={styles.input} id="author" name="author" defaultValue={review?.author} placeholder="Sanne T. — Gardameer, juni 2026" required />
        </div>
      </div>
      <RichTextEditor name="quote" label="Quote" defaultValue={review?.quote} />
      <div className={styles.field}>
        <label className={styles.label} htmlFor="order">Volgorde</label>
        <input className={styles.input} id="order" name="order" type="number" defaultValue={review?.order ?? 0} />
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.button}>Opslaan</button>
      </div>
    </form>
  );
}
