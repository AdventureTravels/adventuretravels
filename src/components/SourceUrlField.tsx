"use client";

import { useEffect, useRef } from "react";

/** Verborgen veld met de pagina waar het formulier stond (na hydratie gevuld). */
export function SourceUrlField() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.value = window.location.href;
  }, []);
  return <input ref={ref} type="hidden" name="sourceUrl" defaultValue="" />;
}
