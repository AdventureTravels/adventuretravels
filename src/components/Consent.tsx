"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { OPEN_CONSENT_EVENT, readConsent, writeConsent, type ConsentChoice } from "@/lib/consent";
import { track } from "@/lib/analytics";
import styles from "./Consent.module.css";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/**
 * Cookiebanner + laden van GTM en Clarity. Regels:
 * - Vóór een keuze laadt niets en staat de dataLayer op "denied" (Consent Mode v2).
 * - Na een keuze laadt GTM altijd (tags in GTM staan achter een consent-trigger);
 *   Clarity alleen bij "granted".
 * - De keuze staat 180 dagen in de cookie `at_consent` en kan via de footer worden gewijzigd.
 */
export function Consent({ gtmId, clarityId }: { gtmId: string; clarityId: string }) {
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const applyToDataLayer = useCallback((c: ConsentChoice, initial: boolean) => {
    window.dataLayer = window.dataLayer ?? [];
    // Consent Mode v2: gtag('consent', ...) is een arguments-push op de dataLayer.
    const gtag = function (...args: unknown[]) {
      window.dataLayer!.push(args as unknown as Record<string, unknown>);
    };
    if (initial) {
      gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        functionality_storage: "granted",
        security_storage: "granted",
        wait_for_update: 500,
      });
    }
    gtag("consent", "update", {
      ad_storage: c,
      ad_user_data: c,
      ad_personalization: c,
      analytics_storage: c,
    });
    track({ event: "consent_update", consent_analytics: c, consent_marketing: c });
  }, []);

  const loadTags = useCallback(
    (c: ConsentChoice) => {
      if (gtmId) {
        window.dataLayer = window.dataLayer ?? [];
        window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
        loadScript("gtm-script", `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
      }
      if (c === "granted" && clarityId && !window.clarity) {
        window.clarity = (...args: unknown[]) => {
          const q = ((window.clarity as unknown as { q?: unknown[] }).q ??= []);
          q.push(args);
        };
        loadScript("clarity-script", `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`);
      }
    },
    [gtmId, clarityId]
  );

  useEffect(() => {
    // Na hydratie (asynchroon, zodat de server-HTML en de eerste client-render gelijk blijven).
    const timer = window.setTimeout(() => {
      const existing = readConsent();
      setChoice(existing);
      if (existing) {
        applyToDataLayer(existing, true);
        loadTags(existing);
      } else {
        setOpen(true);
      }
    }, 0);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
    };
  }, [applyToDataLayer, loadTags]);

  const decide = (c: ConsentChoice) => {
    writeConsent(c);
    const first = choice === null || choice === undefined;
    setChoice(c);
    setOpen(false);
    applyToDataLayer(c, first);
    if (c === "denied" && !first && window.clarity) {
      // Clarity kan niet worden "ontladen"; een herlaad zet de nieuwe keuze door.
      window.location.reload();
      return;
    }
    loadTags(c);
  };

  if (!open) return null;

  return (
    <div className={styles.banner} role="dialog" aria-live="polite" aria-label="Cookies">
      <div className={styles.text}>
        <strong>Cookies voor statistiek en marketing</strong>
        <p>
          Met je toestemming meten we hoe de site wordt gebruikt en kunnen we advertenties afstemmen. Zonder toestemming werkt de site
          precies hetzelfde. Zie ons <Link href="/privacy">privacybeleid</Link>.
        </p>
      </div>
      <div className={styles.buttons}>
        <button type="button" className={styles.button} onClick={() => decide("denied")}>
          Weigeren
        </button>
        <button type="button" className={styles.button} onClick={() => decide("granted")}>
          Accepteren
        </button>
      </div>
    </div>
  );
}
