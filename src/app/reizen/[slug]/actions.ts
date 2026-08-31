"use server";

import { redirect } from "next/navigation";
import { createBookingRequest } from "@/lib/content/bookings";
import { getTripBySlug } from "@/lib/content/trips";

export async function createBookingRequestAction(slug: string, formData: FormData) {
  const trip = await getTripBySlug(slug);
  if (!trip) redirect(`/reizen/${slug}`);

  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  await createBookingRequest({
    tripId: trip.id,
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: phone || undefined,
    preferredDate: trip.fixedDepartureDate ?? String(formData.get("preferredDate") ?? "").trim(),
    message: message || undefined,
  });

  redirect(`/reizen/${slug}?aangevraagd=1`);
}
