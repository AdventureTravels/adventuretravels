/**
 * Feature flags uit de omgeving.
 * CHECKOUT_ENABLED staat sinds Fase 4 standaard aan; zet 'm op "false" om online
 * boeken uit te zetten. Reizen blijven dan gewoon zichtbaar, met "Bel om te
 * boeken" in plaats van de checkout (zie isBookable in src/lib/publish.ts).
 */
export const CHECKOUT_ENABLED = process.env.CHECKOUT_ENABLED !== "false";
