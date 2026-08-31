"use client";

import styles from "../../admin.module.css";

const STATUS_LABELS: Record<string, string> = {
  new: "Nieuw",
  contacted: "Contact gehad",
  done: "Afgerond",
};

export function BookingStatusSelect({
  action,
  status,
}: {
  action: (formData: FormData) => void;
  status: string;
}) {
  return (
    <form action={action}>
      <select
        className={styles.select}
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </form>
  );
}
