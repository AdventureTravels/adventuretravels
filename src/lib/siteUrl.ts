/** Publieke site-URL zonder trailing slash. Een lege of ongeldige env-waarde valt terug op productie. */
function pick(value: string | undefined, fallback: string): string {
  const v = (value ?? "").trim().replace(/\/+$/, "");
  if (!v) return fallback;
  try {
    new URL(v);
    return v;
  } catch {
    return fallback;
  }
}

export const SITE_URL = pick(process.env.NEXT_PUBLIC_SITE_URL, "https://adventuretravels.nl");
export const PORTAL_URL = pick(process.env.PORTAL_URL, "https://mijn.adventuretravels.nl");
