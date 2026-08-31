"use client";

import { useRef, useState } from "react";
import styles from "./admin.module.css";

export function ImageUploadField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const isUploaded = value.startsWith("/uploads/");

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload mislukt");
      setValue(data.path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload mislukt");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.imageUploadRow}>
        {isUploaded ? (
          <img src={value} alt="" className={styles.imageUploadPreview} />
        ) : (
          <div className={styles.imageUploadPreviewEmpty}>{value || "Geen afbeelding"}</div>
        )}
        <div className={styles.imageUploadControls}>
          <input
            className={styles.input}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Label (placeholder) of upload een foto"
          />
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploaden…" : "Foto uploaden"}
          </button>
        </div>
      </div>
      {error && <span className={styles.error}>{error}</span>}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
