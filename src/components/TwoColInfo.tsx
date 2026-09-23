import { RichText } from "./RichText";
import styles from "./TwoColInfo.module.css";

/** Twee kolommen tekst. Per item plain tekst (`text`) of rich text uit de
 * admin (`html`); een item zonder inhoud rendert niet. */
export function TwoColInfo({
  items,
}: {
  items: { title: string; text?: string; html?: string }[];
}) {
  const filled = items.filter((item) => item.text || item.html);
  if (filled.length === 0) return null;

  return (
    <div className={styles.grid}>
      {filled.map((item) => (
        <div key={item.title} className={styles.cell}>
          <h2 className={styles.title}>{item.title}</h2>
          {item.html ? <RichText html={item.html} className={styles.text} /> : <p className={styles.text}>{item.text}</p>}
        </div>
      ))}
    </div>
  );
}
