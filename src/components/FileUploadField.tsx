"use client";

import { useRef, useState } from "react";
import styles from "./FileUploadField.module.css";

export function FileUploadField({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

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
    <div className={styles.row}>
      {value ? (
        <a href={value} target="_blank" rel="noreferrer" className={styles.file}>
          Bestand bekijken
        </a>
      ) : (
        <span className={styles.empty}>Geen bestand</span>
      )}
      <input
        ref={fileInput}
        type="file"
        accept="application/pdf"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <button type="button" className={styles.button} onClick={() => fileInput.current?.click()} disabled={uploading}>
        {uploading ? "Uploaden…" : "PDF uploaden"}
      </button>
      {error && <span className={styles.error}>{error}</span>}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
