import Link from "next/link";
import { SiteImage, isImageUrl } from "./SiteImage";
import { ArrowIcon } from "./icons";
import styles from "./ArticleCard.module.css";

export function ArticleCard({
  href,
  image,
  tag,
  title,
  text,
}: {
  href: string;
  image: string;
  tag: string;
  title: string;
  text: string;
}) {
  return (
    <Link href={href} className={styles.card}>
      {isImageUrl(image) && (
        <div className={styles.image}>
          <SiteImage src={image} alt={title} />
        </div>
      )}
      <div className={styles.body}>
        <span className={styles.tag}>{tag}</span>
        <div className={styles.title}>{title}</div>
        <p className={styles.text}>{text}</p>
        <span className={styles.cta}>
          Lees verder
          <ArrowIcon size={13} />
        </span>
      </div>
    </Link>
  );
}
