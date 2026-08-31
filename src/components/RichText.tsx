import DOMPurify from "isomorphic-dompurify";
import styles from "./RichText.module.css";

const ALLOWED_TAGS = ["p", "strong", "em", "b", "i", "ul", "ol", "li", "a", "br", "h2", "h3"];
const ALLOWED_ATTR = ["href", "target", "rel"];

export function RichText({ html, className }: { html: string; className?: string }) {
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
  const combined = className ? `${styles.richText} ${className}` : styles.richText;
  return <div className={combined} dangerouslySetInnerHTML={{ __html: clean }} />;
}
