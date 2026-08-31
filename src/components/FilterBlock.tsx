"use client";

import type { ReactNode } from "react";
import { ArrowIcon, ChevronDownIcon } from "./icons";
import styles from "./FilterBlock.module.css";

export type FilterFieldConfig = {
  key: string;
  label: string;
  icon: ReactNode;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

export function FilterBlock({
  title = "Filter het aanbod",
  meta,
  fields,
  submitLabel,
  onSubmit,
  bottom,
}: {
  title?: string;
  meta: string;
  fields: FilterFieldConfig[];
  submitLabel: string;
  onSubmit?: () => void;
  bottom?: ReactNode;
}) {
  return (
    <div className={styles.block}>
      <div className={styles.head}>
        <div className={styles.title}>{title}</div>
        <span className={styles.meta}>{meta}</span>
      </div>
      <div className={styles.fields}>
        {fields.map((field, i) => (
          <div
            key={field.key}
            className={i === fields.length - 1 ? `${styles.field} ${styles.fieldLast}` : styles.field}
          >
            <span className={styles.fieldLabel}>{field.label}</span>
            <div className={styles.fieldValueRow}>
              <div className={styles.fieldValue}>
                {field.icon}
                <span className={styles.selectDisplay}>
                  {field.options.find((opt) => opt.value === field.value)?.label ?? field.value}
                </span>
              </div>
              <ChevronDownIcon className={styles.chevron} />
              <select
                className={styles.select}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                aria-label={field.label}
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        <button type="button" className={styles.submit} onClick={onSubmit}>
          {submitLabel}
          <ArrowIcon size={15} />
        </button>
      </div>
      {bottom}
    </div>
  );
}
