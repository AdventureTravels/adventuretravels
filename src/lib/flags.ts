/**
 * Feature flags uit de omgeving. Een flag staat pas aan als de waarde
 * letterlijk "true" is.
 */
export const CHECKOUT_ENABLED = process.env.CHECKOUT_ENABLED === "true";
