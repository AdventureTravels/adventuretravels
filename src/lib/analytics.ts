/**
 * Events naar de dataLayer. GTM beslist op basis van de consent-status of een
 * tag mag vuren; hier wordt nooit direct iets naar Google of Meta gestuurd.
 * Client-safe.
 */
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type AnalyticsEvent =
  | { event: "view_trip"; trip_slug: string; trip_title: string; trip_type: string; value?: number; currency: "EUR" }
  | { event: "begin_checkout"; trip_slug: string; value: number; currency: "EUR"; persons: number }
  | { event: "add_payment_info"; trip_slug: string; value: number; currency: "EUR" }
  | { event: "purchase"; transaction_id: string; value: number; currency: "EUR"; trip_slug: string }
  | { event: "generate_lead"; lead_type: "guide_callback" | "group_inquiry" | "contact" | "pdf_request"; trip_slug?: string }
  | { event: "consent_update"; consent_analytics: "granted" | "denied"; consent_marketing: "granted" | "denied" };

export function track(payload: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

/** Eén keer per sleutel (bv. purchase per boekingsnummer), ook na een refresh. */
export function trackOnce(key: string, payload: AnalyticsEvent) {
  try {
    const store = window.localStorage;
    const mark = `at_tracked:${key}`;
    if (store.getItem(mark)) return;
    store.setItem(mark, "1");
  } catch {
    // opslag geblokkeerd: dan gewoon één keer nu
  }
  track(payload);
}
