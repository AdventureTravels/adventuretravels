"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/consent";

/** Footer-link die de cookiebanner opnieuw opent om de keuze te wijzigen. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "inherit", cursor: "pointer", letterSpacing: "inherit", textTransform: "inherit" }}
    >
      Cookie-instellingen
    </button>
  );
}
