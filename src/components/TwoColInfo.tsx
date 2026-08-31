import styles from "./TwoColInfo.module.css";

export function TwoColInfo({
  items,
}: {
  items: { title: string; text: string }[];
}) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item.title} className={styles.cell}>
          <h2 className={styles.title}>{item.title}</h2>
          <p className={styles.text}>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
