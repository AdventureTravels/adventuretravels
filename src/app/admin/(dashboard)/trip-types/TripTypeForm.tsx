import type { TripType } from "@prisma/client";
import { ICON_OPTIONS } from "@/lib/iconLookup";
import styles from "../../admin.module.css";

export function TripTypeForm({
  action,
  type,
}: {
  action: (formData: FormData) => void;
  type?: TripType;
}) {
  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">Titel</label>
          <input className={styles.input} id="title" name="title" defaultValue={type?.title} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="icon">Icoon</label>
          <select className={styles.select} id="icon" name="icon" defaultValue={type?.icon ?? ICON_OPTIONS[0]}>
            {ICON_OPTIONS.map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="meta">Meta-tekst (bv. &quot;9 reizen · v.a. € 1.680&quot;)</label>
          <input className={styles.input} id="meta" name="meta" defaultValue={type?.meta} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="href">Link (pad, bv. /reizen)</label>
          <input className={styles.input} id="href" name="href" defaultValue={type?.href} required />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="order">Volgorde</label>
        <input className={styles.input} id="order" name="order" type="number" defaultValue={type?.order ?? 0} />
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.button}>Opslaan</button>
      </div>
    </form>
  );
}
