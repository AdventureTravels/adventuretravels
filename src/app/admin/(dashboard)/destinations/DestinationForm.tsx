import type { Destination } from "@prisma/client";
import { RichTextEditor } from "../../RichTextEditor";
import { ImageUploadField } from "../../ImageUploadField";
import styles from "../../admin.module.css";

export function DestinationForm({
  action,
  destination,
}: {
  action: (formData: FormData) => void;
  destination?: Destination;
}) {
  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Naam</label>
          <input className={styles.input} id="name" name="name" defaultValue={destination?.name} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="slug">Slug (in de URL)</label>
          <input className={styles.input} id="slug" name="slug" defaultValue={destination?.slug} required />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="heroTitle">Hero-titel</label>
        <input className={styles.input} id="heroTitle" name="heroTitle" defaultValue={destination?.heroTitle} required />
      </div>
      <RichTextEditor name="heroSubtitle" label="Hero-subtitel" defaultValue={destination?.heroSubtitle} />
      <ImageUploadField name="heroImage" label="Hero-afbeelding" defaultValue={destination?.heroImage} />
      <ImageUploadField name="cardImage" label="Kaart-afbeelding" defaultValue={destination?.cardImage} />
      <div className={styles.field}>
        <label className={styles.label} htmlFor="caption">Bijschrift</label>
        <input className={styles.input} id="caption" name="caption" defaultValue={destination?.caption} required />
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="flightTime">Vliegtijd</label>
          <input className={styles.input} id="flightTime" name="flightTime" defaultValue={destination?.flightTime} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bestPeriod">Beste periode</label>
          <input className={styles.input} id="bestPeriod" name="bestPeriod" defaultValue={destination?.bestPeriod} required />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="order">Volgorde</label>
        <input className={styles.input} id="order" name="order" type="number" defaultValue={destination?.order ?? 0} />
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.button}>Opslaan</button>
      </div>
    </form>
  );
}
