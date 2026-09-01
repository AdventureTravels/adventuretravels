"use server";

import { redirect } from "next/navigation";
import { createBookingRequest } from "@/lib/content/bookings";
import { getTripBySlug } from "@/lib/content/trips";
import { requestMagicLink } from "@/lib/customerAuth";

export async function createBookingRequestAction(slug: string, formData: FormData) {
  const trip = await getTripBySlug(slug);
  if (!trip) redirect(`/reizen/${slug}`);

  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  await createBookingRequest({
    tripId: trip.id,
    name: String(formData.get("name") ?? "").trim(),
    email,
    phone: phone || undefined,
    preferredDate: trip.fixedDepartureDate ?? String(formData.get("preferredDate") ?? "").trim(),
    message: message || undefined,
  });

  try {
    await requestMagicLink(email);
  } catch (error) {
    console.error("Kon magic link niet versturen na boeking:", error);
  }

  redirect(`/reizen/${slug}?aangevraagd=1`);
}
