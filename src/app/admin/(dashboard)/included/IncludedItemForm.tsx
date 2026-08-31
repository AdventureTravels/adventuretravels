import type { IncludedItem } from "@prisma/client";
import { ICON_OPTIONS } from "@/lib/iconLookup";
import { RichTextEditor } from "../../RichTextEditor";
import styles from "../../admin.module.css";

export function IncludedItemForm({
  action,
  item,
}: {
  action: (formData: FormData) => void;
  item?: IncludedItem;
}) {
  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">Titel</label>
          <input className={styles.input} id="title" name="title" defaultValue={item?.title} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="icon">Icoon</label>
          <select className={styles.select} id="icon" name="icon" defaultValue={item?.icon ?? ICON_OPTIONS[0]}>
            {ICON_OPTIONS.map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      </div>
      <RichTextEditor name="bodyHtml" label="Tekst" defaultValue={item?.bodyHtml} />
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
