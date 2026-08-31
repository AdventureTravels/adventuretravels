import type { ReactNode } from "react";
import styles from "./ComingSoonTile.module.css";

export function ComingSoonTile({
  text,
  height,
  icon,
  variant = "paragraph",
}: {
  text: string;
  height?: number;
  icon?: ReactNode;
  variant?: "paragraph" | "label";
}) {
  return (
    <div className={styles.tile} style={height ? { minHeight: height } : undefined}>
      {icon}
      <p className={variant === "label" ? styles.label : styles.text}>{text}</p>
    </div>
  );
}
