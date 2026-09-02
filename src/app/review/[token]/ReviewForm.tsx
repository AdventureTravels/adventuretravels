"use client";

import { useActionState, useState } from "react";
import { submitReviewAction, type ReviewFormState } from "./actions";
import { Turnstile } from "@/components/Turnstile";
import { FormPrivacy } from "@/components/FormPrivacy";
import { ArrowIcon } from "@/components/icons";
import styles from "@/components/RequestForm.module.css";

export function ReviewForm({
  token,
  tripTitle,
  firstName,
  place,
  siteKey,
}: {
  token: string;
  tripTitle: string;
  firstName: string;
  place: string;
  siteKey: string | null;
}) {
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(submitReviewAction.bind(null, token), null);
  const [rating, setRating] = useState(0);

  if (state?.ok) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Dank je wel.</h2>
        <p className={styles.success}>Je review is binnen. We lezen hem na en zetten hem daarna bij {tripTitle} op de site.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles.card}>
      <div>
        <h2 className={styles.title}>Hoe was {tripTitle}?</h2>
        <p className={styles.subtitle}>Eerlijk is het meest nuttig, ook als iets tegenviel.</p>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Score</span>
        <div role="radiogroup" aria-label="Score" style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} style={{ cursor: "pointer", fontSize: 30, lineHeight: 1 }} title={`${n} van 5`}>
              <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} required style={{ position: "absolute", opacity: 0, width: 1, height: 1 }} />
              <span aria-hidden style={{ color: n <= rating ? "#C7513C" : "#c6bea8" }}>★</span>
            </label>
          ))}
        </div>
      </div>
      <div className={styles.grid}>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="text">Je review</label>
          <textarea id="text" name="text" className={styles.textarea} minLength={20} required placeholder="Wat was goed, wat kon beter, voor wie is deze reis?" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="firstName">Voornaam (we tonen voornaam + initiaal)</label>
          <input id="firstName" name="firstName" className={styles.input} defaultValue={firstName} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="place">Woonplaats (optioneel)</label>
          <input id="place" name="place" className={styles.input} defaultValue={place} />
        </div>
      </div>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, lineHeight: 1.6 }}>
        <input type="checkbox" name="consent" required style={{ marginTop: 4 }} />
        <span>AdventureTravels mag deze review met mijn voornaam, initiaal en woonplaats op de website tonen.</span>
      </label>
      <Turnstile siteKey={siteKey} />
      <FormPrivacy purpose="je review te beoordelen en, met je toestemming, te tonen" />
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <div className={styles.footerRow}>
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Bezig…" : "Verstuur review"}
          <ArrowIcon size={15} />
        </button>
      </div>
    </form>
  );
}
