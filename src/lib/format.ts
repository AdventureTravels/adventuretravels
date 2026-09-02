import type { Prisma } from "@prisma/client";

type Amount = Prisma.Decimal | number | string | null | undefined;

function toNumber(value: Amount): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value.toString());
  return Number.isFinite(n) ? n : null;
}

/** Eén formattering voor alle bedragen: "€ 890" of "€ 1.249,50". */
export function formatPrice(value: Amount): string {
  const n = toNumber(value);
  if (n === null) return "";
  const hasCents = Math.round(n * 100) % 100 !== 0;
  return (
    "€ " +
    n.toLocaleString("nl-NL", {
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: hasCents ? 2 : 0,
    })
  );
}

export function amountToNumber(value: Amount): number {
  return toNumber(value) ?? 0;
}

const MONTHS = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

export function monthName(month: number): string {
  return MONTHS[Math.min(12, Math.max(1, month)) - 1];
}

/** "maart t/m november" */
export function formatSeason(startMonth: number, endMonth: number): string {
  if (startMonth === 1 && endMonth === 12) return "het hele jaar";
  return `${monthName(startMonth)} t/m ${monthName(endMonth)}`;
}

export function formatNights(min: number, max: number): string {
  if (min === max) return `${min} ${min === 1 ? "nacht" : "nachten"}`;
  return `${min}–${max} nachten`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}
