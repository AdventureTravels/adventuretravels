import styles from "./PaymentMethods.module.css";

/** De betaalmethoden die Mollie voor ons activeert. Tekstbadges tot de
 * officiële methode-afbeeldingen uit de Mollie-API komen (Fase 4). */
export const PAYMENT_METHODS = [
  { id: "ideal", label: "iDEAL" },
  { id: "creditcard", label: "Creditcard" },
  { id: "banktransfer", label: "Bankoverschrijving" },
] as const;

export function PaymentMethods({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`${styles.list} ${compact ? styles.compact : ""}`} aria-label="Betaalmethoden">
      {PAYMENT_METHODS.map((m) => (
        <li key={m.id} className={styles.badge}>
          {m.label}
        </li>
      ))}
    </ul>
  );
}
