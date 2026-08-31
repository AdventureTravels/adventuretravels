"use client";

import { useRef, useState } from "react";
import { ArrowIcon, AlertCircleIcon, CheckCircleIcon } from "@/components/icons";
import styles from "./page.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [bericht, setBericht] = useState("");
  const [touched, setTouched] = useState({ naam: false, email: false });
  const [attempted, setAttempted] = useState(false);

  const naamRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const naamError = (touched.naam || attempted) && !naam.trim();
  const emailError =
    (touched.email || attempted) && (!email.trim() || !EMAIL_RE.test(email.trim()));

  const hasErrors = !naam.trim() || !email.trim() || !EMAIL_RE.test(email.trim());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!hasErrors) return;
    e.preventDefault();
    setAttempted(true);
    setTouched({ naam: true, email: true });
    if (!naam.trim()) {
      naamRef.current?.focus();
    } else {
      emailRef.current?.focus();
    }
  };

  return (
    <form
      className={styles.formCard}
      action="mailto:hallo@adventuretravels.nl?subject=Contactformulier"
      method="post"
      encType="text/plain"
      onSubmit={handleSubmit}
      noValidate
    >
      {attempted && hasErrors && (
        <div className={styles.formNotice}>
          <AlertCircleIcon size={19} />
          <div>
            <span className={styles.formNoticeStrong}>Twee velden vragen nog aandacht. </span>
            Controleer de gemarkeerde velden en verstuur opnieuw.
          </div>
        </div>
      )}

      <div className={styles.formLabel}>Formulier</div>

      <div className={styles.field}>
        <label
          htmlFor="naam"
          className={naamError ? `${styles.fieldLabel} ${styles.fieldLabelError}` : styles.fieldLabel}
        >
          Naam
        </label>
        <input
          id="naam"
          name="naam"
          ref={naamRef}
          type="text"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, naam: true }))}
          className={naamError ? `${styles.input} ${styles.inputError}` : styles.input}
        />
        {naamError && (
          <div className={styles.errorMessage}>
            <AlertCircleIcon size={14} />
            <span>Vul je naam in, zodat we je goed kunnen aanspreken.</span>
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label
          htmlFor="email"
          className={emailError ? `${styles.fieldLabel} ${styles.fieldLabelError}` : styles.fieldLabel}
        >
          E-mail
        </label>
        <input
          id="email"
          name="email"
          ref={emailRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          className={emailError ? `${styles.input} ${styles.inputError}` : styles.input}
        />
        {emailError && (
          <div className={styles.errorMessage}>
            <AlertCircleIcon size={14} />
            <span>Dit e-mailadres lijkt niet compleet — controleer het deel na de @.</span>
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="onderwerp" className={styles.fieldLabel}>
          Onderwerp
        </label>
        <select id="onderwerp" name="onderwerp" defaultValue="Algemeen" className={styles.select}>
          <option value="Algemeen">Algemeen</option>
          <option value="Boeking">Boeking</option>
          <option value="Groepen & bedrijven">Groepen &amp; bedrijven</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="bericht" className={styles.fieldLabel}>
          Bericht
        </label>
        <textarea
          id="bericht"
          name="bericht"
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          className={styles.textarea}
        />
        {bericht.trim() && (
          <div className={styles.validMessage}>
            <CheckCircleIcon size={17} color="#5E5E4E" strokeWidth={2.4} />
            <span>Ingevuld</span>
          </div>
        )}
      </div>

      <button type="submit" className={styles.submit}>
        Verstuur
        <ArrowIcon size={15} />
      </button>
    </form>
  );
}
