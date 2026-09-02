import Link from "next/link";
import type { ReactNode } from "react";
import { SiteImage } from "./SiteImage";
import { ArrowIcon } from "./icons";
import styles from "./CategoryCard.module.css";

export function CategoryCard({
  href,
  image,
  imageAlt,
  icon,
  name,
  nameSize = 20,
  height = 300,
  subLabel,
  caption,
  ctaLabel,
}: {
  href: string;
  image: string;
  imageAlt: string;
  icon: ReactNode;
  name: string;
  nameSize?: number;
  height?: number;
  subLabel?: string;
  caption: string;
  ctaLabel: string;
}) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.image} style={{ height }}>
        <SiteImage src={image} alt={imageAlt} />
        <div className={styles.gradient} />
        <div className={styles.overlay}>
          <div className={styles.overlayTop}>
            {icon}
            <span className={styles.name} style={{ fontSize: nameSize }}>
              {name}
            </span>
          </div>
          {subLabel && <span className={styles.subLabel}>{subLabel}</span>}
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.caption}>{caption}</p>
        <span className={styles.cta}>
          {ctaLabel}
          <ArrowIcon size={13} />
        </span>
      </div>
    </Link>
  );
}
