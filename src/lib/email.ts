import { Resend } from "resend";
import type { BookingWithRelations } from "@/lib/content/bookings";
import { bookingSummary, bookingSummaryHtml } from "@/lib/bookingSummary";
import { getSiteSettings } from "@/lib/content/settings";
import { formatDate, formatPrice } from "@/lib/format";
import type { BankTransferDetails } from "@/lib/mollie";

const FROM = "AdventureTravels <boekingen@adventuretravels.nl>";
import { SITE_URL, PORTAL_URL } from "@/lib/siteUrl";

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

type Attachment = { filename: string; content: Buffer };

export async function sendEmail(opts: { to: string; subject: string; html: string; attachments?: Attachment[]; replyTo?: string }) {
  if (!isEmailConfigured()) {
    console.warn(`RESEND_API_KEY ontbreekt; mail "${opts.subject}" aan ${opts.to} niet verzonden.`);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    html: wrap(opts.html),
    replyTo: opts.replyTo,
    attachments: opts.attachments?.map((a) => ({ filename: a.filename, content: a.content })),
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

function wrap(inner: string) {
  return `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#23261f;max-width:640px">${inner}
    <p style="margin-top:32px;font-size:12px;color:#5e5e4e">AdventureTravels · <a href="${SITE_URL}" style="color:#a63f2c">${SITE_URL.replace(/^https?:\/\//, "")}</a></p></div>`;
}

/** Haalt een pdf op uit Vercel Blob als bijlage; null als er geen URL is of het ophalen mislukt. */
export async function fetchPdfAttachment(url: string, filename: string): Promise<Attachment | null> {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { filename, content: Buffer.from(await res.arrayBuffer()) };
  } catch (error) {
    console.warn(`Pdf ${url} niet opgehaald:`, error);
    return null;
  }
}

export async function sendMagicLinkEmail(email: string, url: string) {
  await sendEmail({
    to: email,
    subject: "Je inloglink voor Mijn AdventureTravels",
    html: `
      <p>Klik op onderstaande link om je boeking(en) te bekijken. Deze link is 30 minuten geldig.</p>
      <p><a href="${url}">${url}</a></p>
      <p>Heb je deze link niet aangevraagd? Dan kun je deze e-mail negeren.</p>
    `,
  });
}

export async function sendBookingConfirmation(booking: BookingWithRelations) {
  const settings = await getSiteSettings();
  const summary = bookingSummary(booking);
  const infoForm = await fetchPdfAttachment(settings.infoFormPdfUrl, "standaardinformatieformulier-pakketreis.pdf");
  await sendEmail({
    to: booking.contactEmail,
    subject: `Bevestiging van je boeking ${booking.bookingNumber} — ${booking.trip.title}`,
    replyTo: settings.email,
    html: `
      <p>Hoi ${esc(booking.contactName.split(" ")[0])},</p>
      <p>Je betaling is binnen en je reis is geboekt. Hieronder staat alles wat je nodig hebt; bewaar deze mail.</p>
      ${bookingSummaryHtml(summary)}
      <h2 style="font-size:16px;margin:24px 0 8px">Hoe nu verder</h2>
      <ol style="padding-left:18px">
        ${booking.flightRequested ? "<li>Binnen 24 uur sturen we een vluchtvoorstel met prijs. Pas na jouw akkoord boeken we de vlucht; die wordt apart gefactureerd.</li>" : "<li>Boek je vlucht zelf, of laat het ons weten als je wilt dat wij dat alsnog doen.</li>"}
        <li>Twee weken voor vertrek ontvang je de praktische informatie: adres van het verblijf, transfer en contact van je gids.</li>
        <li>Je boeking, deelnemers en facturen beheer je op <a href="${PORTAL_URL}">${PORTAL_URL.replace(/^https?:\/\//, "")}</a>. Log in met dit e-mailadres.</li>
      </ol>
      ${infoForm ? "<p>Het standaardinformatieformulier voor pakketreizen zit als bijlage bij deze mail.</p>" : ""}
      <p>Vragen? Antwoord op deze mail of bel ${esc(settings.phone)}.</p>
    `,
    attachments: infoForm ? [infoForm] : undefined,
  });
}

export async function sendAdminBookingNotification(booking: BookingWithRelations) {
  const settings = await getSiteSettings();
  const summary = bookingSummary(booking);
  await sendEmail({
    to: settings.email,
    subject: `Nieuwe betaalde boeking ${booking.bookingNumber} — ${booking.trip.title}${booking.flightRequested ? " (vlucht gevraagd)" : ""}`,
    html: `
      <p>Er is een nieuwe boeking betaald.</p>
      ${bookingSummaryHtml(summary)}
      ${booking.flightRequested ? `<p><strong>Actie:</strong> binnen 24 uur een vluchtvoorstel sturen (vertrek vanaf ${esc(booking.departureAirport ?? "onbekend")}).</p>` : ""}
      <p><a href="${PORTAL_URL}/staff/${booking.id}">Open in het staff-portaal</a></p>
    `,
  });
}

export async function sendBankTransferInstructions(booking: BookingWithRelations, details: BankTransferDetails, expiresAt: string | null) {
  const settings = await getSiteSettings();
  await sendEmail({
    to: booking.contactEmail,
    subject: `Betaalinstructies voor je boeking ${booking.bookingNumber}`,
    replyTo: settings.email,
    html: `
      <p>Hoi ${esc(booking.contactName.split(" ")[0])},</p>
      <p>Je hebt gekozen voor bankoverschrijving. Je boeking ${esc(booking.bookingNumber)} voor ${esc(booking.trip.title)} is definitief zodra het bedrag binnen is${expiresAt ? `; maak het uiterlijk ${formatDate(expiresAt)} over` : ""}. Na 7 dagen zonder betaling vervalt de boeking automatisch.</p>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#5e5e4e">Bedrag</td><td>${esc(formatPrice(booking.totalAmount))}</td></tr>
        ${details.bankName ? `<tr><td style="padding:4px 12px 4px 0;color:#5e5e4e">Bank</td><td>${esc(details.bankName)}</td></tr>` : ""}
        ${details.bankAccount ? `<tr><td style="padding:4px 12px 4px 0;color:#5e5e4e">IBAN</td><td>${esc(details.bankAccount)}</td></tr>` : ""}
        ${details.bankBic ? `<tr><td style="padding:4px 12px 4px 0;color:#5e5e4e">BIC</td><td>${esc(details.bankBic)}</td></tr>` : ""}
        ${details.transferReference ? `<tr><td style="padding:4px 12px 4px 0;color:#5e5e4e">Omschrijving</td><td><strong>${esc(details.transferReference)}</strong> (verplicht, anders kan de betaling niet worden gekoppeld)</td></tr>` : ""}
      </table>
      <p>Zodra de betaling binnen is, ontvang je de bevestiging met de volledige prijsopbouw en de annuleringsvoorwaarden.</p>
    `,
  });
}

export async function sendBankTransferReminder(booking: BookingWithRelations) {
  const settings = await getSiteSettings();
  await sendEmail({
    to: booking.contactEmail,
    subject: `Herinnering: betaling voor boeking ${booking.bookingNumber}`,
    replyTo: settings.email,
    html: `
      <p>Hoi ${esc(booking.contactName.split(" ")[0])},</p>
      <p>We hebben de betaling van ${esc(formatPrice(booking.totalAmount))} voor je boeking ${esc(booking.bookingNumber)} (${esc(booking.trip.title)}) nog niet ontvangen. De betaalinstructies staan in de vorige mail.</p>
      <p>Is het bedrag al overgemaakt? Dan kun je deze herinnering negeren; een overschrijving kan een tot twee werkdagen duren. Zonder betaling vervalt de boeking 7 dagen na het boeken automatisch.</p>
      <p>Vragen? Antwoord op deze mail of bel ${esc(settings.phone)}.</p>
    `,
  });
}

export async function sendBookingAutoCancelled(booking: BookingWithRelations) {
  const settings = await getSiteSettings();
  await sendEmail({
    to: booking.contactEmail,
    subject: `Boeking ${booking.bookingNumber} is vervallen`,
    replyTo: settings.email,
    html: `
      <p>Hoi ${esc(booking.contactName.split(" ")[0])},</p>
      <p>We hebben binnen 7 dagen geen betaling ontvangen voor je boeking ${esc(booking.bookingNumber)} (${esc(booking.trip.title)}). De boeking is daarom vervallen en er is niets in rekening gebracht.</p>
      <p>Wil je alsnog mee? Boek dan opnieuw via <a href="${SITE_URL}/reizen/${booking.trip.slug}">${SITE_URL.replace(/^https?:\/\//, "")}/reizen/${booking.trip.slug}</a>, of bel ${esc(settings.phone)}.</p>
    `,
  });
}

export async function sendReviewRequest(booking: BookingWithRelations, url: string) {
  const settings = await getSiteSettings();
  await sendEmail({
    to: booking.contactEmail,
    subject: `Hoe was ${booking.trip.title}?`,
    replyTo: settings.email,
    html: `
      <p>Hoi ${esc(booking.contactName.split(" ")[0])},</p>
      <p>Je bent een paar dagen terug van ${esc(booking.trip.title)}. Wil je in twee minuten vertellen hoe het was? Je review helpt de volgende reiziger kiezen, en ons om de reis beter te maken.</p>
      <p><a href="${url}" style="display:inline-block;padding:12px 20px;background:#c7513c;color:#fff;text-decoration:none">Schrijf je review</a></p>
      <p style="font-size:13px;color:#5e5e4e">Alleen jij kunt via deze link een review plaatsen; we tonen je voornaam met initiaal en, als je dat wilt, je woonplaats. Publiceren doen we pas na een check op de inhoud.</p>
    `,
  });
}

export async function sendProgramPdf(to: string, name: string, pdf: Attachment) {
  const settings = await getSiteSettings();
  await sendEmail({
    to,
    subject: "Het programma van AdventureTravels",
    replyTo: settings.email,
    html: `
      <p>Hoi ${esc(name.split(" ")[0])},</p>
      <p>Hierbij het programma als pdf, zoals beloofd. Geen vervolgmails, tenzij je je hebt aangemeld voor de nieuwsbrief.</p>
      <p>Vragen over je niveau of een reis? Bel ${esc(settings.phone)} of antwoord op deze mail.</p>
    `,
    attachments: [pdf],
  });
}

export async function sendLeadNotification(subject: string, lines: [string, string][]) {
  const settings = await getSiteSettings();
  await sendEmail({
    to: settings.email,
    subject,
    html: `<table style="border-collapse:collapse;font-size:14px">${lines
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5e5e4e">${esc(k)}</td><td>${esc(v)}</td></tr>`)
      .join("")}</table>`,
  });
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
