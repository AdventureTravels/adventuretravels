"use server";

import { createLead } from "@/lib/content/leads";
import { getSiteSettings } from "@/lib/content/settings";
import { fetchPdfAttachment, sendProgramPdf } from "@/lib/email";
import { findOrCreateGroup, isMailerLiteConfigured, subscribeToGroup } from "@/lib/mailerlite";

export type ProgramPdfState = { ok: boolean; error?: string } | null;

const NEWSLETTER_GROUP = "Nieuwsbrief";

export async function requestProgramPdfAction(_prev: ProgramPdfState, formData: FormData): Promise<ProgramPdfState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const newsletterOptIn = formData.get("newsletterOptIn") === "on";
  const sourceUrl = String(formData.get("sourceUrl") ?? "").trim() || null;
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Vul je naam en een geldig e-mailadres in." };

  const settings = await getSiteSettings();
  const pdf = await fetchPdfAttachment(settings.programPdfUrl, "adventuretravels-programma.pdf");
  if (!pdf) return { ok: false, error: "De pdf is op dit moment niet beschikbaar. Probeer het later opnieuw." };

  await createLead({ type: "pdf_request", name, email, newsletterOptIn, sourceUrl });

  try {
    await sendProgramPdf(email, name, pdf);
  } catch (error) {
    console.error("Programma-pdf mailen mislukt:", error);
    return { ok: false, error: "Versturen is niet gelukt. Probeer het later opnieuw." };
  }

  if (newsletterOptIn && isMailerLiteConfigured()) {
    try {
      await subscribeToGroup(email, await findOrCreateGroup(NEWSLETTER_GROUP));
    } catch (error) {
      console.error("MailerLite-aanmelding mislukt:", error);
    }
  }
  return { ok: true };
}
