"use client";

import { statusLabel, STATUS_OPTIONS } from "@/lib/bookingStatus";
import styles from "@/app/admin/admin.module.css";

export function StaffStatusSelect({
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
        {STATUS_OPTIONS.map((value) => (
          <option key={value} value={value}>
            {statusLabel(value)}
          </option>
        ))}
      </select>
    </form>
  );
}
