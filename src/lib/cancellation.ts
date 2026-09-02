/**
 * Annuleringsstaffel van een partner. Eén bron, één renderer: reispagina,
 * checkout, bevestigingsmail en portaal gebruiken allemaal
 * renderCancellationPolicy() op dezelfde data.
 */
export type CancellationTier = {
  /** Vanaf zoveel dagen vóór aankomst geldt dit percentage (grens inclusief). */
  daysBefore: number;
  /** Percentage van de reissom dat je betaalt bij annulering in dit venster. */
  pct: number;
};

export function parseCancellationPolicy(value: unknown): CancellationTier[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => ({
      daysBefore: Number((row as CancellationTier)?.daysBefore),
      pct: Number((row as CancellationTier)?.pct),
    }))
    .filter((row) => Number.isFinite(row.daysBefore) && Number.isFinite(row.pct));
}

/**
 * Geldig = minstens één rij, dagen aflopend (eerste rij is het vroegste
 * annuleringsmoment), percentages oplopend streng, laatste rij 100%.
 * Retourneert een foutmelding of null.
 */
export function validateCancellationPolicy(tiers: CancellationTier[]): string | null {
  if (tiers.length === 0) return "De staffel heeft minstens één rij nodig.";
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    if (!Number.isInteger(t.daysBefore) || t.daysBefore < 0) return `Rij ${i + 1}: dagen moet een geheel getal ≥ 0 zijn.`;
    if (t.pct < 0 || t.pct > 100) return `Rij ${i + 1}: percentage moet tussen 0 en 100 liggen.`;
    if (i > 0) {
      if (t.daysBefore >= tiers[i - 1].daysBefore) return `Rij ${i + 1}: dagen moeten aflopen ten opzichte van rij ${i}.`;
      if (t.pct <= tiers[i - 1].pct) return `Rij ${i + 1}: percentage moet hoger zijn dan rij ${i}.`;
    }
  }
  if (tiers[tiers.length - 1].pct !== 100) return "De laatste rij moet 100% zijn.";
  return null;
}

export function isCancellationPolicyValid(value: unknown): boolean {
  return validateCancellationPolicy(parseCancellationPolicy(value)) === null;
}

/**
 * "Tot 60 dagen voor aankomst betaal je 25% van de reissom, van 59 tot 30
 * dagen 50%, en vanaf 29 dagen voor aankomst 100%."
 */
export function renderCancellationPolicy(value: unknown, moment = "aankomst"): string {
  const tiers = parseCancellationPolicy(value);
  if (tiers.length === 0) return "";
  const parts = tiers.map((t, i) => {
    const pct = `${t.pct}%`;
    if (i === 0) return `Tot ${t.daysBefore} dagen voor ${moment} betaal je ${pct} van de reissom`;
    const upper = tiers[i - 1].daysBefore - 1;
    if (i === tiers.length - 1) return `en vanaf ${upper} dagen voor ${moment} ${pct}`;
    return `van ${upper} tot ${t.daysBefore} dagen ${pct}`;
  });
  return parts.join(", ") + ".";
}

/** Dezelfde staffel als losse regels, voor lijsten en tabellen. */
export function cancellationPolicyRows(value: unknown, moment = "aankomst"): { window: string; pct: number }[] {
  const tiers = parseCancellationPolicy(value);
  return tiers.map((t, i) => {
    if (i === 0) return { window: `Tot ${t.daysBefore} dagen voor ${moment}`, pct: t.pct };
    const upper = tiers[i - 1].daysBefore - 1;
    if (i === tiers.length - 1) return { window: `Vanaf ${upper} dagen voor ${moment}`, pct: t.pct };
    return { window: `${upper} tot ${t.daysBefore} dagen voor ${moment}`, pct: t.pct };
  });
}
