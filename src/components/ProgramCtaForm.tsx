"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { requestProgramPdfAction, type ProgramPdfState } from "@/lib/actions/programPdf";
import { ArrowIcon } from "./icons";
import { track } from "@/lib/analytics";
import { Turnstile } from "./Turnstile";
import { SourceUrlField } from "./SourceUrlField";
import styles from "./ProgramCta.module.css";

export function ProgramCtaForm({ siteKey }: { siteKey: string | null }) {
  const [state, formAction, pending] = useActionState<ProgramPdfState, FormData>(requestProgramPdfAction, null);
  useEffect(() => {
    if (state?.ok) track({ event: "generate_lead", lead_type: "pdf_request" });
  }, [state?.ok]);

  if (state?.ok) {
    return <p className={styles.success}>De pdf is onderweg naar je inbox.</p>;
  }

  return (
    <form action={formAction} className={styles.form}>
      <SourceUrlField />
      <div className={styles.formRow}>
        <input type="text" name="name" required placeholder="Je naam" aria-label="Naam" autoComplete="name" className={styles.emailField} />
        <input type="email" name="email" required placeholder="jouw@email.nl" aria-label="E-mailadres" autoComplete="email" className={styles.emailField} />
        <button type="submit" disabled={pending} className={styles.submit}>
          {pending ? "Bezig…" : "Stuur de pdf"}
          <ArrowIcon size={14} />
        </button>
      </div>
      <label className={styles.optIn}>
        <input type="checkbox" name="newsletterOptIn" />
        <span>Houd me op de hoogte van nieuwe reizen (nieuwsbrief, afmelden in één klik)</span>
      </label>
      <Turnstile siteKey={siteKey} />
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <p className={styles.fineprint}>
        We gebruiken je naam en e-mailadres alleen om de pdf te sturen. Zie ons <Link href="/privacy">privacybeleid</Link>.
      </p>
    </form>
  );
}
