import styles from "./PageIntro.module.css";

export function PageIntro({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className={styles.intro}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h1 className={styles.heading}>{title}</h1>
      {subtitle && <p className={styles.subheading}>{subtitle}</p>}
    </div>
  );
}
