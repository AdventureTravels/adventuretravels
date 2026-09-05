"use client";

import { useState } from "react";
import type { ArticleSection } from "@/lib/content/articles";
import { RichTextEditor } from "../../RichTextEditor";
import styles from "../../admin.module.css";

type EditableSection = ArticleSection & { key: string };

let nextId = 0;
function makeKey() {
  nextId += 1;
  return `new-${nextId}`;
}

export function ArticleSectionsEditor({ sections }: { sections: ArticleSection[] }) {
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
              <label className={styles.label} htmlFor={`section-number-${section.key}`}>
                Nummer (optioneel, bv. &quot;01&quot;)
              </label>
              <input
                className={styles.input}
                id={`section-number-${section.key}`}
                name={`sections[${i}].number`}
                defaultValue={section.number}
              />
            </div>
          </div>
          <RichTextEditor name={`sections[${i}].bodyHtml`} label="Tekst" defaultValue={section.bodyHtml} />
          <RichTextEditor
            name={`sections[${i}].quoteHtml`}
            label="Quote (optioneel)"
            defaultValue={section.quoteHtml}
          />
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`section-faq-${section.key}`}>
              Veelgestelde vragen (optioneel): per blok eerst de vraag, daaronder het antwoord; blokken gescheiden door een lege regel
            </label>
            <textarea
              className={styles.textarea}
              id={`section-faq-${section.key}`}
              name={`sections[${i}].faq`}
              rows={6}
              defaultValue={(section.faq ?? []).map((f) => `${f.question}\n${f.answer.replace(/<[^>]+>/g, "")}`).join("\n\n")}
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
