import styles from "./SiteImage.module.css";

/** True when `src` is een echte, geüploade afbeelding (Blob-URL of lokale upload)
 * en geen leeg veld of oud placeholder-label. */
export function isImageUrl(src: string | null | undefined): src is string {
  if (!src) return false;
  return src.startsWith("/uploads/") || src.startsWith("https://") || src.startsWith("http://");
}

/**
 * Toont een geüploade foto, of niets. Er wordt nooit een stand-in of label
 * gerenderd: ontbreekt de foto, dan ontbreekt het element.
 */
export function SiteImage({
  src,
  alt,
  className,
  loading = "lazy",
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  if (!isImageUrl(src)) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={loading} className={className ?? styles.image} />;
}
