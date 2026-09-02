export const STATUS_OPTIONS = ["pending_payment", "paid", "confirmed", "cancelled", "refunded"] as const;
export type BookingStatus = (typeof STATUS_OPTIONS)[number];

export const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Wacht op betaling",
  paid: "Betaald",
  confirmed: "Bevestigd",
  cancelled: "Geannuleerd",
  refunded: "Terugbetaald",
};

export function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

export function isBookingStatus(value: string): value is BookingStatus {
  return (STATUS_OPTIONS as readonly string[]).includes(value);
}
