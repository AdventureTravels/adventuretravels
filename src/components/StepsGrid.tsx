import styles from "./StepsGrid.module.css";

export function StepsGrid({
  steps,
}: {
  steps: { number: string; title: string; text: string }[];
}) {
  return (
    <div className={styles.grid} style={{ ["--stepCount" as string]: steps.length }}>
      {steps.map((step) => (
        <div key={step.number} className={styles.step}>
          <span className={styles.number}>{step.number}</span>
          <div className={styles.title}>{step.title}</div>
          <p className={styles.text}>{step.text}</p>
        </div>
      ))}
    </div>
  );
}
