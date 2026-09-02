"use client";

import { useActionState } from "react";
import { submitGroupInquiryAction, type LeadFormState } from "@/lib/actions/leads";
import { Turnstile } from "./Turnstile";
import { FormPrivacy } from "./FormPrivacy";
import { SourceUrlField } from "./SourceUrlField";
import { ArrowIcon } from "./icons";
import styles from "./RequestForm.module.css";

export type GroupInquiryConfig = {
  /** Onderwerp van de aanvraag, bv. "Aanvraag groepsreis"; ook het mailonderwerp. */
  subject: string;
  title: string;
  subtitle: string;
  groupSizes: string[];
  sports: string[];
  periods: string[];
  messagePlaceholder: string;
};

/** Aanvraagformulier Groepen & bedrijven → Lead(type=group_inquiry). */
export function RequestForm({ config, siteKey }: { config: GroupInquiryConfig; siteKey: string | null }) {
  const [state, formAction, pending] = useActionState<LeadFormState, FormData>(submitGroupInquiryAction, null);

  if (state?.ok) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Aanvraag ontvangen.</h2>
        <p className={styles.success}>We reageren binnen 1 werkdag met een eerste voorstel of een paar vragen.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles.card}>
      <div>
        <h2 className={styles.title}>{config.title}</h2>
        <p className={styles.subtitle}>{config.subtitle}</p>
      </div>
      <input type="hidden" name="subject" value={config.subject} />
      <SourceUrlField />
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Naam</label>
          <input id="name" name="name" type="text" autoComplete="name" placeholder="Voor- en achternaam" className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="organization">Organisatie</label>
          <input id="organization" name="organization" type="text" autoComplete="organization" placeholder="Bedrijf, vereniging of vriendengroep" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="naam@voorbeeld.nl" className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">Telefoon</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+31 6 …" className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="groupSize">Aantal personen</label>
          <select id="groupSize" name="groupSize" className={styles.select} defaultValue={config.groupSizes[0]}>
            {config.groupSizes.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sport">Sport</label>
          <select id="sport" name="sport" className={styles.select} defaultValue={config.sports[0]}>
            {config.sports.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="period">Periode</label>
          <select id="period" name="period" className={styles.select} defaultValue={config.periods[0]}>
            {config.periods.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="message">Wensen</label>
          <textarea id="message" name="message" placeholder={config.messagePlaceholder} className={styles.textarea} />
        </div>
      </div>
      <Turnstile siteKey={siteKey} />
      <FormPrivacy purpose="je aanvraag te beantwoorden en een voorstel te maken" />
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <div className={styles.footerRow}>
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Bezig…" : "Vraag een voorstel aan"}
          <ArrowIcon size={15} />
        </button>
        <span className={styles.footerNote}>We reageren binnen 1 werkdag.</span>
      </div>
    </form>
  );
}
