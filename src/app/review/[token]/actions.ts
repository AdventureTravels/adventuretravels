"use server";

import { getBookingById } from "@/lib/content/bookings";
import { createReview, getReviewByBookingId } from "@/lib/content/reviews";
import { verifyReviewToken } from "@/lib/reviewToken";
import { verifyTurnstile } from "@/lib/turnstile";
import { monthName } from "@/lib/format";
import { sendLeadNotification } from "@/lib/email";

export type ReviewFormState = { ok: boolean; error?: string } | null;

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function submitReviewAction(token: string, _prev: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  const bookingId = verifyReviewToken(token);
  if (!bookingId) return { ok: false, error: "Deze reviewlink is ongeldig." };
  const botError = await verifyTurnstile(formData);
  if (botError) return { ok: false, error: botError };

  const booking = await getBookingById(bookingId);
  if (!booking || !["paid", "confirmed"].includes(booking.status)) return { ok: false, error: "Deze boeking komt niet in aanmerking voor een review." };
  if (await getReviewByBookingId(bookingId)) return { ok: false, error: "Voor deze boeking is al een review ingestuurd." };

  const rating = Number(formData.get("rating"));
  const body = text(formData, "text");
  const firstName = text(formData, "firstName");
  const place = text(formData, "place") || null;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { ok: false, error: "Geef een score van 1 tot 5." };
  if (body.length < 20) return { ok: false, error: "Schrijf minstens een paar zinnen." };
  if (!firstName) return { ok: false, error: "Vul je voornaam in." };
  if (formData.get("consent") !== "on") return { ok: false, error: "Vink aan dat we je review mogen tonen." };

  const lastName = booking.participants[0]?.lastName || booking.contactName.split(" ").slice(1).join(" ");
  const initial = lastName ? ` ${lastName.trim()[0].toUpperCase()}.` : "";
  const arrival = booking.arrivalDate;
  const travelMonth = `${monthName(arrival.getUTCMonth() + 1)} ${arrival.getUTCFullYear()}`;

  try {
    await createReview({
      bookingId,
      tripId: booking.tripId,
      rating,
      text: body,
      reviewerName: `${firstName}${initial}`,
      reviewerPlace: place,
      travelMonth,
      token,
    });
  } catch (error) {
    console.error("Review opslaan mislukt:", error);
    return { ok: false, error: "Opslaan is niet gelukt. Probeer het later opnieuw." };
  }

  try {
    await sendLeadNotification(`Nieuwe review (${rating}/5) — ${booking.trip.title}`, [
      ["Boeking", booking.bookingNumber],
      ["Naam", `${firstName}${initial}${place ? `, ${place}` : ""}`],
      ["Score", `${rating}/5`],
      ["Tekst", body],
      ["Goedkeuren", "In /admin/reviews"],
    ]);
  } catch (error) {
    console.error("Review-notificatie mislukt:", error);
  }
  return { ok: true };
}
