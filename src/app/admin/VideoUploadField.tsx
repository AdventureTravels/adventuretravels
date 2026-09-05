"use client";

import { useRef, useState } from "react";
import { upload, uploadPresigned } from "@vercel/blob/client";
import styles from "./admin.module.css";

const MAX_MB = 60;

/**
 * Upload van een mp4 voor de hero. Op Vercel gaat het bestand rechtstreeks
 * van de browser naar Blob (token of presigned URL via /api/admin/upload-video,
 * afhankelijk van hoe de store is gekoppeld); lokaal, zonder Blob, via
 * /api/admin/upload naar public/uploads.
 */
export function VideoUploadField({
  name,
  label,
  hint,
  defaultValue,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const isUploaded = value.startsWith("/uploads/") || value.startsWith("https://") || value.startsWith("http://");

  async function handleFile(file: File) {
    setError(null);
    if (file.type !== "video/mp4") {
      setError("Gebruik een mp4-bestand (H.264).");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Bestand is groter dan ${MAX_MB}MB. Comprimeer de video eerst.`);
      return;
    }
    setProgress(0);
    try {
      const res = await fetch("/api/admin/upload-video");
      if (!res.ok) throw new Error(res.status === 401 ? "Sessie verlopen, log opnieuw in." : "Upload-configuratie ophalen mislukt");
      const { mode } = (await res.json()) as { mode: "token" | "oidc" | "local" };
      if (mode !== "local") {
        const options = {
          access: "public" as const,
          contentType: "video/mp4",
          handleUploadUrl: "/api/admin/upload-video",
          multipart: true,
          onUploadProgress: ({ percentage }: { percentage: number }) => setProgress(Math.round(percentage)),
        };
        const pathname = `uploads/${crypto.randomUUID()}.mp4`;
        const blob = mode === "token" ? await upload(pathname, file, options) : await uploadPresigned(pathname, file, options);
        setValue(blob.url);
      } else {
        const formData = new FormData();
        formData.append("file", file);
        const up = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (up.status === 413) throw new Error("Bestand te groot voor deze server (max. 4,5 MB zonder Blob-opslag).");
        const data = await up.json();
        if (!up.ok) throw new Error(data.error ?? "Upload mislukt");
        setValue(data.path);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload mislukt");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.imageUploadRow}>
        {isUploaded ? (
          <video src={value} className={styles.imageUploadPreview} muted playsInline controls preload="metadata" />
        ) : (
          <div className={styles.imageUploadPreviewEmpty}>Geen video: alleen de foto wordt getoond</div>
        )}
        <div className={styles.imageUploadControls}>
          <input
            className={styles.input}
            type="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://… (of upload een mp4)"
          />
          <input
            ref={fileInput}
            type="file"
            accept="video/mp4"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              type="button"
              className={styles.buttonSecondary}
              onClick={() => fileInput.current?.click()}
              disabled={progress !== null}
            >
              {progress !== null ? `Uploaden… ${progress}%` : "Video uploaden"}
            </button>
            {isUploaded && progress === null && (
              <button type="button" className={styles.buttonSecondary} onClick={() => setValue("")}>
                Verwijderen
              </button>
            )}
          </div>
        </div>
      </div>
      {error && <span className={styles.error}>{error}</span>}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
