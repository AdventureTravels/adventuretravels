import { CheckCircleIcon } from "./icons";
import styles from "./TrustStripSimple.module.css";

const DEFAULT_ITEMS = [
  "15% aanbetaling",
  "Kosteloos annuleren tot 45 dagen voor vertrek",
  "Gedekt via VZR Garant",
];

export function TrustStripSimple({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  return (
    <div className={styles.strip}>
      {items.map((item) => (
        <div key={item} className={styles.item}>
          <CheckCircleIcon size={20} color="#C7513C" strokeWidth={2.4} />
          <span className={styles.label}>{item}</span>
        </div>
      ))}
    </div>
  );
}
