import styles from "./Placeholder.module.css";

/**
 * Shows a real uploaded photo when `label` is an /uploads/... path (local dev)
 * or an https:// URL (Vercel Blob in production); otherwise falls back to a
 * stand-in box captioned with the label, for content that hasn't had a photo
 * uploaded yet.
 */
export function Placeholder({ label, showLabel = true }: { label: string; showLabel?: boolean }) {
  if (label.startsWith("/uploads/") || label.startsWith("https://") || label.startsWith("http://")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={label} alt="" className={styles.image} />;
  }

  return (
    <div className={styles.placeholder}>
      {showLabel && <span className={styles.label}>{label}</span>}
    </div>
  );
}
