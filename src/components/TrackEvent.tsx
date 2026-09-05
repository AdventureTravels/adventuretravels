"use client";

import { useEffect } from "react";
import { track, trackOnce, type AnalyticsEvent } from "@/lib/analytics";

/** Vuurt een dataLayer-event bij het laden van een server-gerenderde pagina. */
export function TrackEvent({ payload, onceKey }: { payload: AnalyticsEvent; onceKey?: string }) {
  useEffect(() => {
    if (onceKey) trackOnce(onceKey, payload);
    else track(payload);
    // Eén keer per pagina-weergave.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
