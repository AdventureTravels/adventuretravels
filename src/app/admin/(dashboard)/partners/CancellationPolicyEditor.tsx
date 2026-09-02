"use client";

import { useState } from "react";
import type { CancellationTier } from "@/lib/cancellation";
import styles from "../../admin.module.css";

let nextId = 0;
const key = () => `tier-${++nextId}`;

export function CancellationPolicyEditor({ tiers }: { tiers: CancellationTier[] }) {
  const [rows, setRows] = useState(() =>
    (tiers.length ? tiers : [{ daysBefore: 60, pct: 25 }, { daysBefore: 30, pct: 50 }, { daysBefore: 14, pct: 100 }]).map((t) => ({ key: key(), ...t }))
  );
  const update = (k: string, field: "daysBefore" | "pct", value: string) =>
    setRows((prev) => prev.map((r) => (r.key === k ? { ...r, [field]: Number(value) } : r)));

  return (
    <div className={styles.field}>
      {rows.map((row, i) => (
        <div key={row.key} className={styles.fieldRow} style={{ alignItems: "center" }}>
          <span className={styles.hint} style={{ minWidth: 120 }}>{i === 0 ? "Tot" : "Daarna tot"}</span>
          <input className={styles.input} type="number" min={0} name={`policy[${i}].daysBefore`} value={row.daysBefore} onChange={(e) => update(row.key, "daysBefore", e.target.value)} style={{ maxWidth: 110 }} required />
          <span className={styles.hint}>dagen voor aankomst betaal je</span>
          <input className={styles.input} type="number" min={0} max={100} name={`policy[${i}].pct`} value={row.pct} onChange={(e) => update(row.key, "pct", e.target.value)} style={{ maxWidth: 90 }} required />
          <span className={styles.hint}>%</span>
          <button type="button" className={styles.buttonDanger} onClick={() => setRows((prev) => prev.filter((r) => r.key !== row.key))}>
            Verwijderen
          </button>
        </div>
      ))}
      <div className={styles.actions} style={{ marginTop: 4 }}>
        <button type="button" className={styles.buttonSecondary} onClick={() => setRows((prev) => [...prev, { key: key(), daysBefore: 0, pct: 100 }])}>
          Rij toevoegen
        </button>
      </div>
    </div>
  );
}
