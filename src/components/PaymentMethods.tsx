import { listMollieMethods } from "@/lib/mollie";
import styles from "./PaymentMethods.module.css";

/** Betaalmethoden zoals Mollie ze voor ons activeert, met de officiële
 * afbeeldingen. Zonder Mollie-koppeling: tekstbadges van de drie beloofde methoden. */
const FALLBACK = [
  { id: "ideal", description: "iDEAL", imageSvg: "" },
  { id: "creditcard", description: "Creditcard", imageSvg: "" },
  { id: "banktransfer", description: "Bankoverschrijving", imageSvg: "" },
];

export async function PaymentMethods({ compact = false }: { compact?: boolean }) {
  const live = await listMollieMethods();
  const methods = live.length > 0 ? live : FALLBACK;

  return (
    <ul className={`${styles.list} ${compact ? styles.compact : ""}`} aria-label="Betaalmethoden">
      {methods.map((m) => (
        <li key={m.id} className={m.imageSvg ? styles.logo : styles.badge} title={m.description}>
          {m.imageSvg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.imageSvg} alt={m.description} height={compact ? 22 : 28} />
          ) : (
            m.description
          )}
        </li>
      ))}
    </ul>
  );
}
