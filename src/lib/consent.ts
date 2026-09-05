/**
 * Consent-status voor analytics en marketing. Eén cookie, zes maanden.
 * Niets laadt vóór een keuze; de keuze gaat als `consent_update` naar de dataLayer.
 * Client-safe (geen server-imports).
 */
export const CONSENT_COOKIE = "at_consent";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export type ConsentChoice = "granted" | "denied";

export function readConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`));
  return (match?.[1] as ConsentChoice | undefined) ?? null;
}

export function writeConsent(choice: ConsentChoice) {
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

export function clearConsent() {
  document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

/** Custom event waarmee de footer-link de banner opnieuw opent. */
export const OPEN_CONSENT_EVENT = "at:open-consent";
