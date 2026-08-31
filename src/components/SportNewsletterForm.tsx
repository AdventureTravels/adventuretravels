"use client";

import { useActionState } from "react";
import { subscribeToSportNewsletter } from "@/lib/actions/subscribe";
import styles from "./SportNewsletterForm.module.css";

type State = { ok: boolean; error?: string } | null;

export function SportNewsletterForm({
  sportSlug,
  sportName,
}: {
  sportSlug: string;
  sportName: string;
}) {
  const [state, formAction, pending] = useActionState<State, FormData>(async (_prev, formData) => {
    const email = String(formData.get("email") ?? "");
    return subscribeToSportNewsletter(sportSlug, email);
  }, null);

  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <h3 className={styles.title}>Blijf op de hoogte over {sportName.toLowerCase()}reizen</h3>
        <p className={styles.body}>
          Meld je aan en ontvang als eerste nieuwe {sportName.toLowerCase()}reizen, plekken en
          vertrekdata in je inbox.
        </p>
      </div>

      {state?.ok ? (
        <p className={styles.success}>Bedankt! Je bent aangemeld.</p>
      ) : (
        <form action={formAction} className={styles.form}>
          <input
            type="email"
            name="email"
            required
            placeholder="jouw@email.nl"
            className={styles.input}
          />
          <button type="submit" disabled={pending} className={styles.submit}>
            {pending ? "Bezig…" : "Aanmelden"}
          </button>
        </form>
      )}

      {state?.error && <p className={styles.error}>{state.error}</p>}
    </div>
  );
}
