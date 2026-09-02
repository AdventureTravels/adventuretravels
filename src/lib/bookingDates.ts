const DAY = 24 * 60 * 60 * 1000;

/** Einddatum van de reis: retourdatum van het vertrek, of aankomst + nachten. */
export function tripEndDate(booking: { arrivalDate: Date; nights: number; departure: { returnDate: Date } | null }): Date {
  if (booking.departure) return booking.departure.returnDate;
  return new Date(booking.arrivalDate.getTime() + booking.nights * DAY);
}
