"use client";

import { useState } from "react";
import { ImageUploadField } from "../../ImageUploadField";
import type { GalleryImage } from "@/lib/content/trips";
import styles from "../../admin.module.css";

let nextId = 0;
function makeKey() {
  nextId += 1;
  return `gallery-${nextId}`;
}

export function GalleryEditor({ images }: { images: GalleryImage[] }) {
  const [list, setList] = useState(() => images.map((img) => ({ key: makeKey(), ...img })));

  const addImage = () => setList((prev) => [...prev, { key: makeKey(), src: "", alt: "" }]);
  const removeImage = (key: string) => setList((prev) => prev.filter((item) => item.key !== key));

  return (
    <div className={styles.field}>
      <label className={styles.label}>Fotogalerij</label>
      <span className={styles.hint}>Wordt op de reispagina getoond als een doorklikbare slider. Alt-tekst is verplicht.</span>
      {list.map((item, i) => (
        <div key={item.key} className={styles.fieldRow} style={{ alignItems: "flex-end" }}>
          <div style={{ flex: 2 }}>
            <ImageUploadField name={`gallery[${i}].src`} label={`Foto ${i + 1}`} defaultValue={item.src} />
          </div>
          <div className={styles.field} style={{ flex: 1 }}>
            <label className={styles.label}>Alt-tekst</label>
            <input className={styles.input} name={`gallery[${i}].alt`} defaultValue={item.alt} required />
          </div>
          <button
            type="button"
            className={styles.buttonDanger}
            style={{ marginBottom: 18 }}
            onClick={() => removeImage(item.key)}
          >
            Verwijderen
          </button>
        </div>
      ))}
      <div className={styles.actions} style={{ marginTop: 4 }}>
        <button type="button" className={styles.buttonSecondary} onClick={addImage}>
          Foto toevoegen
        </button>
      </div>
    </div>
  );
}
