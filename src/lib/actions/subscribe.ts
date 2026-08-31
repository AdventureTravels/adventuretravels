"use server";

import { getSportBySlug, setSportMailerliteGroupId } from "@/lib/content/sports";
import { findOrCreateGroup, subscribeToGroup, isMailerLiteConfigured } from "@/lib/mailerlite";

export async function subscribeToSportNewsletter(
  sportSlug: string,
  email: string
): Promise<{ ok: boolean; error?: string }> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) return { ok: false, error: "E-mailadres is verplicht." };

  const sport = await getSportBySlug(sportSlug);
  if (!sport) return { ok: false, error: "Onbekende sport." };

  if (!isMailerLiteConfigured()) {
    console.warn(`MAILERLITE_API_KEY ontbreekt; ${trimmedEmail} is niet aangemeld voor ${sport.name}.`);
    return { ok: true };
  }

  try {
    let groupId = sport.mailerliteGroupId;
    if (!groupId) {
      groupId = await findOrCreateGroup(sport.name);
      await setSportMailerliteGroupId(sport.id, groupId);
    }
    await subscribeToGroup(trimmedEmail, groupId);
    return { ok: true };
  } catch (error) {
    console.error("MailerLite subscribe failed:", error);
    return { ok: false, error: "Aanmelden is niet gelukt. Probeer het later opnieuw." };
  }
}
