"use server";

import { createLead } from "@/lib/content/leads";
import { prisma } from "@/lib/db";
import { sendLeadNotification } from "@/lib/email";
import { verifyTurnstile } from "@/lib/turnstile";

export type LeadFormState = { ok: boolean; error?: string } | null;

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const SAVE_ERROR = "Opslaan is niet gelukt. Probeer het opnieuw of bel ons.";

async function save(input: Parameters<typeof createLead>[0]): Promise<boolean> {
  try {
    await createLead(input);
    return true;
  } catch (error) {
    console.error("Lead opslaan mislukt:", error);
    return false;
  }
}

async function notify(subject: string, lines: [string, string][]) {
  try {
    await sendLeadNotification(subject, lines.filter(([, v]) => v));
  } catch (error) {
    console.error(`Lead-notificatie "${subject}" mislukt:`, error);
  }
}

/** "Spreek een gids": terugbelverzoek met reiscontext. */
export async function submitGuideCallbackAction(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const botError = await verifyTurnstile(formData);
  if (botError) return { ok: false, error: botError };

  const name = text(formData, "name");
  const email = text(formData, "email").toLowerCase();
  const phone = text(formData, "phone");
  if (!name || !phone || !EMAIL_RE.test(email)) return { ok: false, error: "Vul je naam, telefoonnummer en een geldig e-mailadres in." };

  const tripId = text(formData, "tripId") || null;
  const trip = tripId ? await prisma.trip.findUnique({ where: { id: tripId }, select: { id: true, title: true } }) : null;
  const preferredDay = text(formData, "preferredDay") || null;
  const preferredDaypart = text(formData, "preferredDaypart") || null;
  const message = text(formData, "message") || null;
  const sourceUrl = text(formData, "sourceUrl") || null;

  if (!(await save({ type: "guide_callback", name, email, phone, tripId: trip?.id ?? null, preferredDay, preferredDaypart, message, sourceUrl }))) return { ok: false, error: SAVE_ERROR };
  await notify(`Terugbelverzoek${trip ? ` — ${trip.title}` : ""}: ${name}`, [
    ["Naam", name],
    ["Telefoon", phone],
    ["E-mail", email],
    ["Reis", trip?.title ?? "geen reis gekozen"],
    ["Wanneer bellen", [preferredDay, preferredDaypart].filter(Boolean).join(", ")],
    ["Vraag", message ?? ""],
    ["Pagina", sourceUrl ?? ""],
  ]);
  return { ok: true };
}

/** Groepen & bedrijven. */
export async function submitGroupInquiryAction(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const botError = await verifyTurnstile(formData);
  if (botError) return { ok: false, error: botError };

  const name = text(formData, "name");
  const email = text(formData, "email").toLowerCase();
  const phone = text(formData, "phone");
  if (!name || !EMAIL_RE.test(email) || !phone) return { ok: false, error: "Vul je naam, e-mailadres en telefoonnummer in." };

  const lead = {
    organization: text(formData, "organization") || null,
    groupSize: text(formData, "groupSize") || null,
    sport: text(formData, "sport") || null,
    period: text(formData, "period") || null,
    message: text(formData, "message") || null,
    subject: text(formData, "subject") || null,
    sourceUrl: text(formData, "sourceUrl") || null,
  };
  if (!(await save({ type: "group_inquiry", name, email, phone, ...lead }))) return { ok: false, error: SAVE_ERROR };
  await notify(`${lead.subject ?? "Groepsaanvraag"}: ${lead.organization || name}${lead.groupSize ? ` (${lead.groupSize})` : ""}`, [
    ["Naam", name],
    ["Organisatie", lead.organization ?? ""],
    ["E-mail", email],
    ["Telefoon", phone],
    ["Aantal personen", lead.groupSize ?? ""],
    ["Sport", lead.sport ?? ""],
    ["Periode", lead.period ?? ""],
    ["Wensen", lead.message ?? ""],
    ["Pagina", lead.sourceUrl ?? ""],
  ]);
  return { ok: true };
}

/** Algemeen contactformulier. */
export async function submitContactAction(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const botError = await verifyTurnstile(formData);
  if (botError) return { ok: false, error: botError };

  const name = text(formData, "name");
  const email = text(formData, "email").toLowerCase();
  const message = text(formData, "message");
  if (!name || !EMAIL_RE.test(email) || !message) return { ok: false, error: "Vul je naam, een geldig e-mailadres en je bericht in." };

  const subject = text(formData, "subject") || "Algemeen";
  const phone = text(formData, "phone") || null;
  const sourceUrl = text(formData, "sourceUrl") || null;
  if (!(await save({ type: "contact", name, email, phone, subject, message, sourceUrl }))) return { ok: false, error: SAVE_ERROR };
  await notify(`Contactformulier (${subject}): ${name}`, [
    ["Naam", name],
    ["E-mail", email],
    ["Telefoon", phone ?? ""],
    ["Onderwerp", subject],
    ["Bericht", message],
    ["Pagina", sourceUrl ?? ""],
  ]);
  return { ok: true };
}
