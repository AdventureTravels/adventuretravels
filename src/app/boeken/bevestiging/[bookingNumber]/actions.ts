"use server";

import { redirect } from "next/navigation";
import { getBookingByNumber } from "@/lib/content/bookings";
import { createMolliePayment, isMollieConfigured } from "@/lib/mollie";

/** Nieuwe Mollie-betaling voor een boeking waarvan de vorige betaling is mislukt of verlopen. */
export async function retryPaymentAction(bookingNumber: string) {
  const booking = await getBookingByNumber(bookingNumber);
  if (!booking || booking.status !== "pending_payment" || !isMollieConfigured()) redirect(`/boeken/bevestiging/${bookingNumber}`);
  const url = await createMolliePayment(booking);
  redirect(url);
}
