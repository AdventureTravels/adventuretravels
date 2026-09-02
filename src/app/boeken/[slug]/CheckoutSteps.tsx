import Link from "next/link";
import styles from "./checkout.module.css";

const STEPS = ["Reis", "Gegevens", "Overzicht en betaling"];

export function CheckoutSteps({ current, slug, maxReached }: { current: number; slug: string; maxReached: number }) {
  return (
    <ol className={styles.steps} aria-label="Stappen">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const cls = n === current ? `${styles.step} ${styles.stepActive}` : n < current ? `${styles.step} ${styles.stepDone}` : styles.step;
        return (
          <li key={label} className={cls} aria-current={n === current ? "step" : undefined}>
            <span className={styles.stepNumber}>0{n}</span>
            {n <= maxReached && n !== current ? <Link href={`/boeken/${slug}?step=${n}`}>{label}</Link> : <span>{label}</span>}
          </li>
        );
      })}
    </ol>
  );
}
