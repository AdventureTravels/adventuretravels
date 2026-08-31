import type { FaqItem } from "@prisma/client";
import { RichTextEditor } from "../../RichTextEditor";
import styles from "../../admin.module.css";

export function FaqItemForm({ action, item }: { action: (formData: FormData) => void; item?: FaqItem }) {
  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="question">Vraag</label>
        <input className={styles.input} id="question" name="question" defaultValue={item?.question} required />
      </div>
      <RichTextEditor name="answer" label="Antwoord" defaultValue={item?.answer} />
      <div className={styles.field}>
        <label className={styles.label} htmlFor="order">Volgorde</label>
        <input className={styles.input} id="order" name="order" type="number" defaultValue={item?.order ?? 0} />
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.button}>Opslaan</button>
      </div>
    </form>
  );
}
