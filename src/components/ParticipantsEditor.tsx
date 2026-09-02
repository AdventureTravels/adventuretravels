"use client";

import { useState } from "react";
import { PARTICIPANT_LEVELS, levelLabel } from "@/lib/levels";
import styles from "./ParticipantsEditor.module.css";

export type Participant = {
  firstName: string;
  lastName: string;
  birthdate?: string | null;
  level?: string | null;
  dietaryNotes?: string | null;
};

let nextId = 0;
function makeKey() {
  nextId += 1;
  return `participant-${nextId}`;
}

const EMPTY: Participant = { firstName: "", lastName: "", birthdate: "", level: "", dietaryNotes: "" };

/**
 * Deelnemers zoals op het paspoort. Wordt gebruikt in de checkout (stap 2),
 * het klantportaal en het staff-portaal. Het niveau is voorgevuld vanuit
 * stap 1 en hier alleen te zien, tenzij `editableLevel` aanstaat.
 */
export function ParticipantsEditor({
  participants,
  fixedCount,
  editableLevel = true,
}: {
  participants: Participant[];
  /** Vast aantal rijen (checkout): geen toevoegen/verwijderen. */
  fixedCount?: number;
  editableLevel?: boolean;
}) {
  const [list, setList] = useState(() => {
    const base = participants.length ? participants : [EMPTY];
    const padded = fixedCount ? [...base, ...Array(Math.max(0, fixedCount - base.length)).fill(EMPTY)].slice(0, fixedCount) : base;
    return padded.map((p) => ({ key: makeKey(), ...EMPTY, ...p }));
  });

  const update = (key: string, field: keyof Participant, value: string) =>
    setList((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  const add = () => setList((prev) => [...prev, { key: makeKey(), ...EMPTY }]);
  const remove = (key: string) => setList((prev) => prev.filter((row) => row.key !== key));

  return (
    <div className={styles.editor}>
      {list.map((row, i) => (
        <div key={row.key} className={styles.row}>
          <input
            className={styles.input}
            placeholder={`Voornaam deelnemer ${i + 1} (als op paspoort)`}
            value={row.firstName}
            onChange={(e) => update(row.key, "firstName", e.target.value)}
            name={`participants[${i}].firstName`}
            required
          />
          <input
            className={styles.input}
            placeholder="Achternaam (als op paspoort)"
            value={row.lastName}
            onChange={(e) => update(row.key, "lastName", e.target.value)}
            name={`participants[${i}].lastName`}
            required
          />
          <input
            className={styles.input}
            type="date"
            aria-label="Geboortedatum"
            value={row.birthdate ?? ""}
            onChange={(e) => update(row.key, "birthdate", e.target.value)}
            name={`participants[${i}].birthdate`}
          />
          {editableLevel ? (
            <select
              className={styles.input}
              aria-label="Niveau"
              value={row.level ?? ""}
              onChange={(e) => update(row.key, "level", e.target.value)}
              name={`participants[${i}].level`}
            >
              <option value="">Niveau</option>
              {PARTICIPANT_LEVELS.map((l) => (
                <option key={l} value={l}>{levelLabel(l)}</option>
              ))}
            </select>
          ) : (
            <>
              <span className={styles.static}>{row.level ? levelLabel(row.level) : ""}</span>
              <input type="hidden" name={`participants[${i}].level`} value={row.level ?? ""} />
            </>
          )}
          <input
            className={styles.input}
            placeholder="Dieetwensen (optioneel)"
            value={row.dietaryNotes ?? ""}
            onChange={(e) => update(row.key, "dietaryNotes", e.target.value)}
            name={`participants[${i}].dietaryNotes`}
          />
          {!fixedCount && (
            <button type="button" className={styles.remove} onClick={() => remove(row.key)}>
              Verwijderen
            </button>
          )}
        </div>
      ))}
      {!fixedCount && (
        <button type="button" className={styles.add} onClick={add}>
          Deelnemer toevoegen
        </button>
      )}
    </div>
  );
}
