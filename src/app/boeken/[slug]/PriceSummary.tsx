import type { PriceLine } from "@/lib/content/bookings";
import { formatPrice } from "@/lib/format";
import styles from "./checkout.module.css";

/** Het prijsblok: overal dezelfde regels en hetzelfde totaal. Puur presentatie. */
export function PriceSummary({
  lines,
  total,
  perPerson,
  persons,
  note,
  error,
}: {
  lines: PriceLine[];
  total: string;
  perPerson?: string;
  persons?: number;
  note?: string;
  error?: string | null;
}) {
  return (
    <div className={styles.summary} aria-live="polite">
      <h2 className={styles.summaryTitle}>Prijsopbouw</h2>
      {error ? (
        <p className={styles.summaryNote}>{error}</p>
      ) : (
        <>
          <div className={styles.lines}>
            {lines.map((l, i) => (
              <div key={i} className={styles.line}>
                <span className={styles.lineLabel}>
                  {l.label}
                  {l.qty > 1 && <small>{l.qty} × {formatPrice(l.unitAmount)} p.p.</small>}
                </span>
                <span>{formatPrice(l.amount)}</span>
              </div>
            ))}
          </div>
          <div className={styles.total}>
            <span>Totaal</span>
            <span>{formatPrice(total)}</span>
          </div>
          {perPerson && persons && persons > 1 && <span className={styles.perPerson}>{perPerson} per persoon</span>}
        </>
      )}
      {note && <p className={styles.summaryNote}>{note}</p>}
    </div>
  );
}
