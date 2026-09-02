"use client";

import { useActionState } from "react";
import { submitContactAction, type LeadFormState } from "@/lib/actions/leads";
import { Turnstile } from "@/components/Turnstile";
import { FormPrivacy } from "@/components/FormPrivacy";
import { SourceUrlField } from "@/components/SourceUrlField";
import { ArrowIcon, AlertCircleIcon, CheckCircleIcon } from "@/components/icons";
import styles from "./page.module.css";

export function ContactForm({ siteKey }: { siteKey: string | null }) {
  const [state, formAction, pending] = useActionState<LeadFormState, FormData>(submitContactAction, null);

  if (state?.ok) {
    return (
      <div className={styles.formCard}>
        <div className={styles.validMessage}>
          <CheckCircleIcon size={17} color="#5E5E4E" strokeWidth={2.4} />
          <span>Bedankt, je bericht is binnen. We reageren binnen 1 werkdag.</span>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles.formCard}>
      {state?.error && (
        <div className={styles.formNotice}>
          <AlertCircleIcon size={19} />
          <div>{state.error}</div>
        </div>
      )}
      <div className={styles.formLabel}>Formulier</div>
      <SourceUrlField />

      <div className={styles.field}>
        <label htmlFor="name" className={styles.fieldLabel}>Naam</label>
        <input id="name" name="name" type="text" autoComplete="name" className={styles.input} required />
      </div>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.fieldLabel}>E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" className={styles.input} required />
      </div>
      <div className={styles.field}>
        <label htmlFor="phone" className={styles.fieldLabel}>Telefoon (optioneel)</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={styles.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor="subject" className={styles.fieldLabel}>Onderwerp</label>
        <select id="subject" name="subject" defaultValue="Algemeen" className={styles.select}>
          <option value="Algemeen">Algemeen</option>
          <option value="Boeking">Boeking</option>
          <option value="Groepen & bedrijven">Groepen &amp; bedrijven</option>
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="message" className={styles.fieldLabel}>Bericht</label>
        <textarea id="message" name="message" className={styles.textarea} required />
      </div>

      <Turnstile siteKey={siteKey} />
      <FormPrivacy purpose="je vraag te beantwoorden" />
      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Bezig…" : "Verstuur"}
        <ArrowIcon size={15} />
      </button>
    </form>
  );
}
