import type { Guide } from "@prisma/client";
import { ImageUploadField } from "../../ImageUploadField";
import styles from "../../admin.module.css";

export function GuideForm({ action, guide }: { action: (formData: FormData) => void; guide?: Guide }) {
  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Naam</label>
          <input className={styles.input} id="name" name="name" defaultValue={guide?.name} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="livesIn">Woonplaats</label>
          <input className={styles.input} id="livesIn" name="livesIn" defaultValue={guide?.livesIn} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">Telefoonnummer (op de reispagina; leeg = niet tonen)</label>
          <input className={styles.input} id="phone" name="phone" defaultValue={guide?.phone ?? ""} />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="bio">Bio</label>
        <textarea className={styles.textarea} id="bio" name="bio" rows={3} defaultValue={guide?.bio} required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="sports">Sporten (slugs, kommagescheiden)</label>
        <input className={styles.input} id="sports" name="sports" defaultValue={guide?.sports.join(", ") ?? ""} />
      </div>
      <div className={styles.fieldRow}>
        <div style={{ flex: 2 }}>
          <ImageUploadField name="photo" label="Foto" defaultValue={guide?.photo} />
        </div>
        <div className={styles.field} style={{ flex: 1 }}>
          <label className={styles.label} htmlFor="photoAlt">Alt-tekst foto</label>
          <input className={styles.input} id="photoAlt" name="photoAlt" defaultValue={guide?.photoAlt ?? ""} />
        </div>
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.button}>Opslaan</button>
      </div>
    </form>
  );
}
