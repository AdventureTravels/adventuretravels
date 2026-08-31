import { ArrowIcon, CheckCircleIcon, SunMark } from "./icons";
import styles from "./RequestForm.module.css";

export type RequestField =
  | { name: string; label: string; type: "text" | "email" | "tel"; placeholder: string }
  | { name: string; label: string; type: "select"; options: string[]; defaultValue: string }
  | { name: string; label: string; type: "textarea"; placeholder: string };

export function RequestForm({
  title,
  subtitle,
  fields,
  subject,
}: {
  title: string;
  subtitle: string;
  fields: RequestField[];
  subject: string;
}) {
  return (
    <form
      className={styles.card}
      action={`mailto:hallo@adventuretravels.nl?subject=${encodeURIComponent(subject)}`}
      method="post"
      encType="text/plain"
    >
      <div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.grid}>
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.type === "textarea" ? `${styles.field} ${styles.fieldFull}` : styles.field}
          >
            <label className={styles.label} htmlFor={field.name}>
              {field.label}
            </label>
            {field.type === "select" ? (
              <select id={field.name} name={field.name} defaultValue={field.defaultValue} className={styles.select}>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                className={styles.textarea}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className={styles.input}
              />
            )}
          </div>
        ))}
      </div>
      <div className={styles.footerRow}>
        <button type="submit" className={styles.submit}>
          Vraag een offerte aan
          <ArrowIcon size={15} />
        </button>
        <span className={styles.footerNote}>We reageren binnen 1 werkdag.</span>
      </div>
    </form>
  );
}

export function RequestSidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.callCard}>
        <SunMark size={54} />
        <div className={styles.callTitle}>Liever eerst even bellen?</div>
        <p className={styles.callText}>Spreek een gids · +31 20 244 18 60</p>
      </div>
      <div className={styles.afterCard}>
        <span className={styles.afterLabel}>Na je aanvraag</span>
        <div className={styles.afterList}>
          {[
            "Voorstel met programma en prijs",
            "Dezelfde boekings- en betaalflow als een reguliere reis",
            "15% aanbetaling, kosteloos annuleren tot 45 dagen voor vertrek",
          ].map((item) => (
            <div key={item} className={styles.afterItem}>
              <CheckCircleIcon size={18} color="#C7513C" strokeWidth={2.4} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
