/**
 * Vercel Blob is op twee manieren te koppelen:
 * - klassiek: BLOB_READ_WRITE_TOKEN (read-write token in de env);
 * - OIDC: alleen BLOB_STORE_ID (+ BLOB_WEBHOOK_PUBLIC_KEY); de SDK haalt zelf
 *   een kortlevend OIDC-token op in de Vercel Function. Zo is de store van
 *   adventuretravels gekoppeld.
 * Zonder een van beide (lokaal) gaan uploads naar public/uploads.
 */
export type BlobMode = "token" | "oidc" | "local";

export function blobMode(): BlobMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "token";
  if (process.env.BLOB_STORE_ID) return "oidc";
  return "local";
}

export const hasBlobStorage = () => blobMode() !== "local";
