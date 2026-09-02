/**
 * Eén samenvatting van een boeking voor bevestigingspagina, mails en portaal,
 * zodat overal dezelfde regels, hetzelfde totaal en dezelfde staffel staan.
 */
import type { BookingWithRelations, PriceLine, BookingAddress } from "@/lib/content/bookings";
import { cancellationPolicyRows } from "@/lib/cancellation";
import { formatDate, formatPrice } from "@/lib/format";
import { levelLabel } from "@/lib/levels";

export type SummaryRow = { label: string; value: string };

export type BookingSummary = {
  bookingNumber: string;
  tripTitle: string;
  rows: SummaryRow[];
  participants: string[];
  lines: PriceLine[];
  total: string;
  policyRows: { window: string; pct: number }[];
  policyNotes: string | null;
  flightRequested: boolean;
  departureAirport: string | null;
};

export function bookingSummary(booking: BookingWithRelations): BookingSummary {
  const isGroup = booking.trip.type === "group";
  const rows: SummaryRow[] = [
    { label: "Boekingsnummer", value: booking.bookingNumber },
    { label: "Reis", value: `${booking.trip.title} (${booking.trip.sport.name} · ${booking.trip.destination.name})` },
    isGroup && booking.departure
      ? { label: "Vertrek", value: `${formatDate(booking.departure.departureDate)} – ${formatDate(booking.departure.returnDate)}` }
      : { label: "Aankomst", value: `${formatDate(booking.arrivalDate)}, ${booking.nights} ${booking.nights === 1 ? "nacht" : "nachten"}` },
    { label: "Personen", value: String(Math.max(1, booking.participants.length)) },
    { label: "Hoofdboeker", value: `${booking.contactName}, ${booking.contactEmail}${booking.contactPhone ? `, ${booking.contactPhone}` : ""}` },
  ];
  const address = booking.contactAddress as unknown as Partial<BookingAddress>;
  if (address.street) {
    rows.push({
      label: "Adres",
      value: `${address.street} ${address.houseNumber ?? ""}, ${address.postalCode ?? ""} ${address.city ?? ""}, ${address.country ?? ""}`.replace(/\s+/g, " ").trim(),
    });
  }

  return {
    bookingNumber: booking.bookingNumber,
    tripTitle: booking.trip.title,
    rows,
    participants: booking.participants.map(
      (p) => `${p.firstName} ${p.lastName}`.trim() + (p.level ? ` (${levelLabel(p.level)})` : "") + (p.birthdate ? `, geboren ${p.birthdate}` : "")
    ),
    lines: booking.priceBreakdown as unknown as PriceLine[],
    total: formatPrice(booking.totalAmount),
    policyRows: cancellationPolicyRows(booking.cancellationPolicySnapshot, isGroup ? "vertrek" : "aankomst"),
    policyNotes: booking.trip.partner.cancellationNotes,
    flightRequested: booking.flightRequested,
    departureAirport: booking.departureAirport,
  };
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** HTML-fragment met de samenvatting, voor mails. */
export function bookingSummaryHtml(summary: BookingSummary): string {
  const rows = summary.rows.map((r) => `<tr><td style="padding:4px 12px 4px 0;color:#5e5e4e">${esc(r.label)}</td><td style="padding:4px 0">${esc(r.value)}</td></tr>`).join("");
  const participants = summary.participants.map((p) => `<li>${esc(p)}</li>`).join("");
  const lines = summary.lines
    .map(
      (l) =>
        `<tr><td style="padding:4px 12px 4px 0">${esc(l.label)}${l.qty > 1 ? ` × ${l.qty}` : ""}</td><td style="padding:4px 0;text-align:right">${esc(formatPrice(l.amount))}</td></tr>`
    )
    .join("");
  const policy = summary.policyRows.map((r) => `<li>${esc(r.window)}: ${r.pct}% van de reissom</li>`).join("");
  return `
    <h2 style="font-size:16px;margin:24px 0 8px">Je boeking</h2>
    <table style="border-collapse:collapse;font-size:14px">${rows}</table>
    ${participants ? `<h3 style="font-size:14px;margin:16px 0 4px">Deelnemers</h3><ul style="margin:0;padding-left:18px;font-size:14px">${participants}</ul>` : ""}
    <h3 style="font-size:14px;margin:16px 0 4px">Prijsopbouw</h3>
    <table style="border-collapse:collapse;font-size:14px;min-width:320px">${lines}
      <tr><td style="padding:8px 12px 4px 0;border-top:1px solid #c6bea8"><strong>Totaal</strong></td><td style="padding:8px 0 4px;border-top:1px solid #c6bea8;text-align:right"><strong>${esc(summary.total)}</strong></td></tr>
    </table>
    ${summary.flightRequested ? `<p style="font-size:14px"><strong>Vlucht:</strong> je hebt gevraagd of wij je vlucht bijboeken${summary.departureAirport ? ` vanaf ${esc(summary.departureAirport)}` : ""}. Binnen 24 uur sturen we een voorstel met prijs; de vlucht wordt apart gefactureerd en zit niet in bovenstaand totaal.</p>` : ""}
    <h3 style="font-size:14px;margin:16px 0 4px">Annuleringsvoorwaarden van deze boeking</h3>
    <ul style="margin:0;padding-left:18px;font-size:14px">${policy}</ul>
    ${summary.policyNotes ? `<p style="font-size:13px;color:#5e5e4e">${esc(summary.policyNotes)}</p>` : ""}
  `;
}
