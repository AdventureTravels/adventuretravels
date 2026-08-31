"use client";

import { useState } from "react";
import type { PageSection } from "@/lib/content/pages";
import { RichTextEditor } from "../../RichTextEditor";
import styles from "../../admin.module.css";

type EditableSection = PageSection & { key: string };

let nextId = 0;
function makeKey() {
  nextId += 1;
  return `new-${nextId}`;
}

export function PageSectionsEditor({ sections }: { sections: PageSection[] }) {
  const [list, setList] = useState<EditableSection[]>(() => sections.map((s) => ({ ...s, key: makeKey() })));

  const addSection = () => {
    setList((prev) => [...prev, { key: makeKey(), title: "", bodyHtml: "" }]);
  };

  const removeSection = (key: string) => {
    setList((prev) => prev.filter((s) => s.key !== key));
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>Secties</label>
      <span className={styles.hint}>
        &quot;Type&quot; is optioneel: laat op &quot;Tekst&quot; staan, tenzij deze sectie een cijferblok,
        icoonrij of tabel moet tonen (zoals bij Voorwaarden of Annuleringsvoorwaarden) — vul dan
        de bijbehorende data hieronder als JSON in.
      </span>
      {list.map((section, i) => (
        <div key={section.key} className={styles.card} style={{ marginTop: 12 }}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`section-title-${section.key}`}>Titel</label>
              <input
                className={styles.input}
                id={`section-title-${section.key}`}
                name={`sections[${i}].title`}
                defaultValue={section.title}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`section-kind-${section.key}`}>Type</label>
              <select
                className={styles.select}
                id={`section-kind-${section.key}`}
                name={`sections[${i}].kind`}
                defaultValue={section.kind ?? "text"}
              >
                <option value="text">Tekst</option>
                <option value="stats">Cijferblok</option>
                <option value="icons">Iconenrij</option>
                <option value="table">Tabel</option>
              </select>
            </div>
          </div>
          <RichTextEditor name={`sections[${i}].bodyHtml`} label="Tekst" defaultValue={section.bodyHtml} />
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`section-data-${section.key}`}>
              Data (JSON, alleen nodig bij cijferblok/iconenrij/tabel)
            </label>
            <textarea
              className={styles.textarea}
              id={`section-data-${section.key}`}
              name={`sections[${i}].data`}
              rows={4}
              defaultValue={section.data ? JSON.stringify(section.data, null, 2) : ""}
            />
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.buttonDanger} onClick={() => removeSection(section.key)}>
              Sectie verwijderen
            </button>
          </div>
        </div>
      ))}
      <div className={styles.actions} style={{ marginTop: 12 }}>
        <button type="button" className={styles.buttonSecondary} onClick={addSection}>
          Sectie toevoegen
        </button>
      </div>
    </div>
  );
}
