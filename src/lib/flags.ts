/**
 * Feature flags uit de omgeving.
 * CHECKOUT_ENABLED staat sinds Fase 4 standaard aan; zet 'm op "false" om
 * alle reizen tijdelijk van de site te halen (publicatiecheck).
 */
export const CHECKOUT_ENABLED = process.env.CHECKOUT_ENABLED !== "false";
