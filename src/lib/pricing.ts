/**
 * Eén prijsberekening voor reispagina, checkout (live), server action,
 * bevestiging en mail. Rekent in hele centen (integers); bedragen naar
 * buiten als "1780.00"-strings, zoals Prisma Decimal en Mollie verwachten.
 * Bevat geen server-imports: ook bruikbaar in client components.
 */
import type { PriceLine } from "@/lib/content/bookings";

export type PricingExtra = { id: string; name: string; description: string | null; pricePpCents: number; isPerNight: boolean };
export type PricingDeparture = {
  id: string;
  departureDate: string; // ISO
  returnDate: string; // ISO
  pricePpCents: number;
  seatsLeft: number;
  minParticipants: number;
  bookingDeadline: string; // ISO
};
export type PricingTrip = {
  slug: string;
  title: string;
  type: "individual" | "group";
  pricePpBaseCents: number | null;
  pricePerExtraNightCents: number | null;
  minNights: number;
  maxNights: number;
  seasonStartMonth: number;
  seasonEndMonth: number;
  extras: PricingExtra[];
  departures: PricingDeparture[];
};

export type Selection = {
  departureId: string | null;
  nights: number;
  persons: number;
  extraIds: string[];
};

export function toCents(value: { toString(): string } | string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value.toString());
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export function centsToAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatCents(cents: number): string {
  const hasCents = cents % 100 !== 0;
  return (
    "€ " +
    (cents / 100).toLocaleString("nl-NL", {
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: hasCents ? 2 : 0,
    })
  );
}

export function isMonthInSeason(month: number, start: number, end: number): boolean {
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}

export function isDateInSeason(isoDate: string, trip: Pick<PricingTrip, "seasonStartMonth" | "seasonEndMonth">): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return false;
  return isMonthInSeason(Number(m[2]), trip.seasonStartMonth, trip.seasonEndMonth);
}

export type Breakdown = { lines: PriceLine[]; totalCents: number; total: string; perPersonCents: number };

const line = (label: string, qty: number, unitCents: number): PriceLine => ({
  label,
  qty,
  unitAmount: centsToAmount(unitCents),
  amount: centsToAmount(unitCents * qty),
});

/** Prijsopbouw per regel en per persoon; totaal = som van de regels. Gooit bij een onmogelijke selectie. */
export function calculateBreakdown(trip: PricingTrip, sel: Selection): Breakdown {
  const persons = Math.max(1, Math.floor(sel.persons));
  const lines: PriceLine[] = [];
  let nights = sel.nights;

  if (trip.type === "group") {
    const dep = trip.departures.find((d) => d.id === sel.departureId);
    if (!dep) throw new Error("Kies een vertrek.");
    lines.push(line(`${trip.title}, vertrek ${formatIsoDate(dep.departureDate)} (all-in, incl. vlucht)`, persons, dep.pricePpCents));
    nights = Math.max(1, Math.round((Date.parse(dep.returnDate) - Date.parse(dep.departureDate)) / 86_400_000));
  } else {
    if (trip.pricePpBaseCents === null) throw new Error("Deze reis heeft nog geen prijs.");
    nights = Math.min(trip.maxNights, Math.max(trip.minNights, Math.floor(sel.nights)));
    lines.push(line(`${trip.title}, ${trip.minNights} ${trip.minNights === 1 ? "nacht" : "nachten"}`, persons, trip.pricePpBaseCents));
    const extraNights = nights - trip.minNights;
    if (extraNights > 0) {
      if (trip.pricePerExtraNightCents === null) throw new Error("Deze reis heeft een vaste duur.");
      lines.push(line(`${extraNights} extra ${extraNights === 1 ? "nacht" : "nachten"} à ${formatCents(trip.pricePerExtraNightCents)}`, persons, extraNights * trip.pricePerExtraNightCents));
    }
  }

  for (const id of sel.extraIds) {
    const extra = trip.extras.find((e) => e.id === id);
    if (!extra) continue;
    const unit = extra.isPerNight ? extra.pricePpCents * nights : extra.pricePpCents;
    lines.push(line(extra.isPerNight ? `${extra.name} (${nights} nachten à ${formatCents(extra.pricePpCents)})` : extra.name, persons, unit));
  }

  const totalCents = lines.reduce((sum, l) => sum + Math.round(Number(l.amount) * 100), 0);
  return { lines, totalCents, total: centsToAmount(totalCents), perPersonCents: Math.round(totalCents / persons) };
}

export function formatIsoDate(iso: string): string {
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}
