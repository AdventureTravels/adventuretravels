import type { Partner } from "@prisma/client";
import { parseCancellationPolicy, renderCancellationPolicy } from "@/lib/cancellation";
import { CancellationPolicyEditor } from "./CancellationPolicyEditor";
import styles from "../../admin.module.css";

export function PartnerForm({ action, partner }: { action: (formData: FormData) => void; partner?: Partner }) {
  const tiers = parseCancellationPolicy(partner?.cancellationPolicy);
  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Naam</label>
          <input className={styles.input} id="name" name="name" defaultValue={partner?.name} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="slug">Slug</label>
          <input className={styles.input} id="slug" name="slug" defaultValue={partner?.slug} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="type">Type</label>
          <select className={styles.select} id="type" name="type" defaultValue={partner?.type ?? "park"}>
            <option value="park">Park</option>
            <option value="gym">Gym</option>
            <option value="accommodation">Accommodatie</option>
            <option value="other">Anders</option>
          </select>
        </div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="country">Land</label>
          <input className={styles.input} id="country" name="country" defaultValue={partner?.country} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="city">Plaats</label>
          <input className={styles.input} id="city" name="city" defaultValue={partner?.city} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="commissionPct">Commissie (%)</label>
          <input className={styles.input} id="commissionPct" name="commissionPct" type="number" step="0.01" min={0} max={100} defaultValue={partner?.commissionPct?.toString() ?? ""} />
        </div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contactName">Contactpersoon</label>
          <input className={styles.input} id="contactName" name="contactName" defaultValue={partner?.contactName ?? ""} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contactEmail">E-mail</label>
          <input className={styles.input} id="contactEmail" name="contactEmail" type="email" defaultValue={partner?.contactEmail ?? ""} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contactPhone">Telefoon</label>
          <input className={styles.input} id="contactPhone" name="contactPhone" defaultValue={partner?.contactPhone ?? ""} />
        </div>
      </div>

      <h2 className={styles.label}>Annuleringsstaffel</h2>
      <span className={styles.hint}>
        Oplopend streng: elke volgende rij heeft minder dagen en een hoger percentage; de laatste rij is 100%.
        {tiers.length > 0 && ` Nu: ${renderCancellationPolicy(tiers)}`}
      </span>
      <CancellationPolicyEditor tiers={tiers} />
      <div className={styles.field}>
        <label className={styles.label} htmlFor="cancellationNotes">Toelichting bij de staffel (bv. over de vlucht)</label>
        <textarea className={styles.textarea} id="cancellationNotes" name="cancellationNotes" rows={2} defaultValue={partner?.cancellationNotes ?? ""} />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
        <input type="checkbox" name="isActive" defaultChecked={partner?.isActive ?? true} />
        Actief (reizen van een inactieve partner worden niet getoond)
      </label>

      <div className={styles.actions}>
        <button type="submit" className={styles.button}>Opslaan</button>
      </div>
    </form>
  );
}
