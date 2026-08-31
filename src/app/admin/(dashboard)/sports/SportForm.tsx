import type { Sport } from "@prisma/client";
import { RichTextEditor } from "../../RichTextEditor";
import { ImageUploadField } from "../../ImageUploadField";
import styles from "../../admin.module.css";

export function SportForm({ action, sport }: { action: (formData: FormData) => void; sport?: Sport }) {
  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Naam</label>
          <input className={styles.input} id="name" name="name" defaultValue={sport?.name} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="slug">Slug (in de URL)</label>
          <input className={styles.input} id="slug" name="slug" defaultValue={sport?.slug} required />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="heroTitle">Hero-titel</label>
        <input className={styles.input} id="heroTitle" name="heroTitle" defaultValue={sport?.heroTitle} required />
      </div>
      <RichTextEditor name="heroSubtitle" label="Hero-subtitel" defaultValue={sport?.heroSubtitle} />
      <ImageUploadField name="heroImage" label="Hero-afbeelding" defaultValue={sport?.heroImage} />
      <ImageUploadField name="cardImage" label="Kaart-afbeelding" defaultValue={sport?.cardImage} />
      <div className={styles.field}>
        <label className={styles.label} htmlFor="caption">Bijschrift</label>
        <input className={styles.input} id="caption" name="caption" defaultValue={sport?.caption} required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="order">Volgorde</label>
        <input className={styles.input} id="order" name="order" type="number" defaultValue={sport?.order ?? 0} />
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.button}>Opslaan</button>
      </div>
    </form>
  );
}
