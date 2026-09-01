"use client";

import { useState } from "react";
import styles from "./ParticipantsEditor.module.css";

export type Participant = { name: string; birthdate?: string | null; dietaryNotes?: string | null };

let nextId = 0;
function makeKey() {
  nextId += 1;
  return `participant-${nextId}`;
}

export function ParticipantsEditor({ participants }: { participants: Participant[] }) {
  const [list, setList] = useState(() =>
    (participants.length ? participants : [{ name: "" }]).map((p) => ({ key: makeKey(), ...p }))
  );

  const update = (key: string, field: keyof Participant, value: string) =>
    setList((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  const add = () => setList((prev) => [...prev, { key: makeKey(), name: "" }]);
  const remove = (key: string) => setList((prev) => prev.filter((row) => row.key !== key));

  return (
    <div className={styles.editor}>
      {list.map((row, i) => (
        <div key={row.key} className={styles.row}>
          <input
            className={styles.input}
            placeholder={`Naam deelnemer ${i + 1}`}
            value={row.name}
            onChange={(e) => update(row.key, "name", e.target.value)}
            name={`participants[${i}].name`}
          />
          <input
            className={styles.input}
            placeholder="Geboortedatum (optioneel)"
            value={row.birthdate ?? ""}
            onChange={(e) => update(row.key, "birthdate", e.target.value)}
            name={`participants[${i}].birthdate`}
          />
          <input
            className={styles.input}
            placeholder="Dieetwensen (optioneel)"
            value={row.dietaryNotes ?? ""}
            onChange={(e) => update(row.key, "dietaryNotes", e.target.value)}
            name={`participants[${i}].dietaryNotes`}
          />
          <button type="button" className={styles.remove} onClick={() => remove(row.key)}>
            Verwijderen
          </button>
        </div>
      ))}
      <button type="button" className={styles.add} onClick={add}>
        Deelnemer toevoegen
      </button>
    </div>
  );
}
