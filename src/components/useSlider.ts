"use client";

import { useCallback, useRef, useState } from "react";

/** Drives a horizontally-scrolling row of cards: prev/next buttons that page
 * by ~75% of the visible width, plus an optional progress readout. */
export function useSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState({ width: 100, left: 0 });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const width = Math.max(10, Math.round((el.clientWidth / el.scrollWidth) * 100));
    const max = el.scrollWidth - el.clientWidth;
    const p = max ? el.scrollLeft / max : 0;
    const left = Math.round(p * (100 - width));
    setProgress({ width, left });
  }, []);

  const scroll = useCallback(
    (dir: -1 | 1) => {
      const el = ref.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      const to = Math.max(0, Math.min(max, el.scrollLeft + dir * Math.round(el.clientWidth * 0.75)));
      el.scrollLeft = to;
      measure();
    },
    [measure],
  );

  return { ref, progress, onScroll: measure, prev: () => scroll(-1), next: () => scroll(1) };
}
