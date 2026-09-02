/**
 * Cloudflare Turnstile op alle publieke formulieren.
 * Sleutels: TURNSTILE_SITE_KEY (naar de client via een prop) en TURNSTILE_SECRET.
 * Zonder sleutels: lokaal de officiële testsleutels van Cloudflare (altijd
 * geslaagd), in productie een luide waarschuwing en doorlaten, zodat een
 * vergeten variabele geen klanten blokkeert.
 */
import { headers } from "next/headers";

const TEST_SITE_KEY = "1x00000000000000000000AA";
const TEST_SECRET = "1x0000000000000000000000000000000AA";

export const TURNSTILE_FIELD = "cf-turnstile-response";

export function turnstileSiteKey(): string | null {
  const key = process.env.TURNSTILE_SITE_KEY;
  if (key) return key;
  if (process.env.NODE_ENV !== "production") return TEST_SITE_KEY;
  return null;
}

function turnstileSecret(): string | null {
  const secret = process.env.TURNSTILE_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return TEST_SECRET;
  return null;
}

/** Controleert het token uit het formulier bij Cloudflare. Retourneert een foutmelding of null. */
export async function verifyTurnstile(formData: FormData): Promise<string | null> {
  const secret = turnstileSecret();
  if (!secret) {
    console.error("TURNSTILE_SECRET ontbreekt; formulier zonder botcontrole doorgelaten.");
    return null;
  }
  const token = String(formData.get(TURNSTILE_FIELD) ?? "");
  if (!token) return "De botcontrole is niet afgerond. Wacht even en probeer opnieuw.";

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (!data.success) {
      console.warn("Turnstile geweigerd:", data["error-codes"]);
      return "De botcontrole is mislukt. Vernieuw de pagina en probeer opnieuw.";
    }
    return null;
  } catch (error) {
    console.error("Turnstile-verificatie mislukt:", error);
    return "De botcontrole is tijdelijk niet bereikbaar. Probeer het zo opnieuw.";
  }
}
