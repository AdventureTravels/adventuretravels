"use client";

import { useActionState } from "react";
import { submitGuideCallbackAction, type LeadFormState } from "@/lib/actions/leads";
import { Turnstile } from "@/components/Turnstile";
import { FormPrivacy } from "@/components/FormPrivacy";
import { SourceUrlField } from "@/components/SourceUrlField";
import { ArrowIcon } from "@/components/icons";
import styles from "@/components/RequestForm.module.css";

const DAYS = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
const DAYPARTS = ["Ochtend (9–12)", "Middag (12–17)", "Avond (17–20)"];

export function GuideForm({ tripId, tripTitle, siteKey }: { tripId: string | null; tripTitle: string | null; siteKey: string | null }) {
  const [state, formAction, pending] = useActionState<LeadFormState, FormData>(submitGuideCallbackAction, null);

  if (state?.ok) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>We bellen je terug.</h2>
        <p className={styles.subtitle}>Je verzoek is binnen. Een gids belt je op het moment dat je hebt gekozen, of zo snel mogelijk daarna.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles.card}>
      <div>
        <h2 className={styles.title}>Spreek een gids</h2>
        <p className={styles.subtitle}>
          {tripTitle ? `Over ${tripTitle}: ` : ""}twijfel over je niveau, je board of de reis? Laat je nummer achter, dan belt een gids je terug.
        </p>
      </div>
      {tripId && <input type="hidden" name="tripId" value={tripId} />}
      <SourceUrlField />
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Naam</label>
          <input id="name" name="name" type="text" autoComplete="name" className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">Telefoon</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="preferredDay">Gewenste dag</label>
          <select id="preferredDay" name="preferredDay" className={styles.select} defaultValue="">
            <option value="">Maakt niet uit</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="preferredDaypart">Dagdeel</label>
          <select id="preferredDaypart" name="preferredDaypart" className={styles.select} defaultValue="">
            <option value="">Maakt niet uit</option>
            {DAYPARTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="message">Je vraag</label>
          <textarea id="message" name="message" className={styles.textarea} placeholder="Bijvoorbeeld: ik rij rondjes maar val bij de eerste kicker, welk niveau kies ik?" />
        </div>
      </div>
      <Turnstile siteKey={siteKey} />
      <FormPrivacy purpose="je terug te bellen over je vraag" />
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <div className={styles.footerRow}>
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Bezig…" : "Bel me terug"}
          <ArrowIcon size={15} />
        </button>
        <span className={styles.footerNote}>We bellen binnen 1 werkdag.</span>
      </div>
    </form>
  );
}
