import Link from "next/link";
import { Placeholder } from "./Placeholder";
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
      <div className={styles.image}>
        <Placeholder label={image} />
      </div>
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
