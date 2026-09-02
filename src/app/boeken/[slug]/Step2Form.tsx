import Link from "next/link";
import { ParticipantsEditor } from "@/components/ParticipantsEditor";
import type { CheckoutStep1, CheckoutStep2 } from "@/lib/checkoutSession";
import styles from "./checkout.module.css";

export function Step2Form({
  slug,
  step1,
  initial,
  action,
  error,
}: {
  slug: string;
  step1: CheckoutStep1;
  initial?: CheckoutStep2;
  action: (formData: FormData) => void;
  error?: string;
}) {
  const participants =
    initial?.participants.length === step1.persons
      ? initial.participants
      : Array.from({ length: step1.persons }, (_, i) => ({
          firstName: initial?.participants[i]?.firstName ?? "",
          lastName: initial?.participants[i]?.lastName ?? "",
          birthdate: initial?.participants[i]?.birthdate ?? "",
          level: step1.levels[i] ?? "",
          dietaryNotes: initial?.participants[i]?.dietaryNotes ?? "",
        }));

  return (
    <form action={action} className={styles.main}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Hoofdboeker</h2>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contactName">Naam</label>
            <input className={styles.input} id="contactName" name="contactName" autoComplete="name" defaultValue={initial?.contactName} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contactEmail">E-mailadres</label>
            <input className={styles.input} id="contactEmail" name="contactEmail" type="email" autoComplete="email" defaultValue={initial?.contactEmail} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contactPhone">Telefoon</label>
            <input className={styles.input} id="contactPhone" name="contactPhone" type="tel" autoComplete="tel" defaultValue={initial?.contactPhone} required />
          </div>
        </div>
        <p className={styles.hint}>Je adres hebben we nodig voor de factuur en de reisdocumenten; verder gebruiken we het nergens voor.</p>
        <div className={styles.fieldRow}>
          <div className={styles.field} style={{ gridColumn: "span 2" }}>
            <label className={styles.label} htmlFor="street">Straat</label>
            <input className={styles.input} id="street" name="street" autoComplete="address-line1" defaultValue={initial?.address.street} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="houseNumber">Huisnummer</label>
            <input className={styles.input} id="houseNumber" name="houseNumber" defaultValue={initial?.address.houseNumber} required />
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="postalCode">Postcode</label>
            <input className={styles.input} id="postalCode" name="postalCode" autoComplete="postal-code" defaultValue={initial?.address.postalCode} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="city">Plaats</label>
            <input className={styles.input} id="city" name="city" autoComplete="address-level2" defaultValue={initial?.address.city} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="country">Land</label>
            <input className={styles.input} id="country" name="country" autoComplete="country-name" defaultValue={initial?.address.country ?? "Nederland"} required />
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{step1.persons === 1 ? "Reiziger" : "Reizigers"}</h2>
        <p className={styles.hint}>Voor- en achternaam precies zoals op het paspoort. Het niveau heb je in stap 1 gekozen.</p>
        <ParticipantsEditor participants={participants} fixedCount={step1.persons} editableLevel={false} />
      </div>

      <p className={styles.privacy}>
        We gebruiken deze gegevens alleen om je reis te boeken en uit te voeren. Zie ons <Link href="/privacy">privacybeleid</Link>.
      </p>

      <div className={styles.actions}>
        <Link href={`/boeken/${slug}?step=1`} className={styles.back}>Terug naar stap 1</Link>
        <button type="submit" className={styles.primary}>Verder naar het overzicht</button>
      </div>
    </form>
  );
}
