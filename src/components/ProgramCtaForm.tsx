"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestProgramPdfAction, type ProgramPdfState } from "@/lib/actions/programPdf";
import { ArrowIcon } from "./icons";
import styles from "./ProgramCta.module.css";

export function ProgramCtaForm() {
  const [state, formAction, pending] = useActionState<ProgramPdfState, FormData>(requestProgramPdfAction, null);

  if (state?.ok) {
    return <p className={styles.success}>De pdf is onderweg naar je inbox.</p>;
  }

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="sourceUrl" value={typeof window !== "undefined" ? window.location.href : ""} />
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
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <p className={styles.fineprint}>
        We gebruiken je naam en e-mailadres alleen om de pdf te sturen. Zie ons <Link href="/privacy">privacybeleid</Link>.
      </p>
    </form>
  );
}
