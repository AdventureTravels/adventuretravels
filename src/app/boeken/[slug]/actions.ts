"use server";

import { redirect } from "next/navigation";
import { getTripBySlug } from "@/lib/content/trips";
import { getOpenDeparturesWithAvailability } from "@/lib/content/departures";
import { getSiteSettings } from "@/lib/content/settings";
import { createBooking, type BookingAddress } from "@/lib/content/bookings";
import { readCheckoutDraft, writeCheckoutDraft, clearCheckoutDraft, type CheckoutStep1, type CheckoutStep2 } from "@/lib/checkoutSession";
import { calculateBreakdown, isDateInSeason } from "@/lib/pricing";
import { pricingTripFrom } from "@/lib/pricingTrip";
import { parseCancellationPolicy } from "@/lib/cancellation";
import { participantsFromForm } from "@/lib/participantsForm";
import { PARTICIPANT_LEVELS } from "@/lib/levels";
import { createMolliePayment, isMollieConfigured } from "@/lib/mollie";
import { verifyTurnstile } from "@/lib/turnstile";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

function fail(slug: string, step: number, message: string): never {
  redirect(`/boeken/${slug}?step=${step}&error=${encodeURIComponent(message)}`);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export async function saveStep1Action(slug: string, formData: FormData) {
  const trip = await getTripBySlug(slug);
  if (!trip) redirect(`/reizen/${slug}`);
  const isGroup = trip.type === "group";
  const departures = isGroup ? await getOpenDeparturesWithAvailability(trip.id, trip.departures) : [];
  const pricing = pricingTripFrom(trip, departures);

  const persons = Math.max(1, Math.min(12, Number(formData.get("persons") ?? 1)));
  const levels = Array.from({ length: persons }, (_, i) => text(formData, `levels[${i}]`));
  if (levels.some((l) => !(PARTICIPANT_LEVELS as readonly string[]).includes(l))) fail(slug, 1, "Kies voor elke persoon een niveau.");

  const step1: CheckoutStep1 = {
    departureId: isGroup ? text(formData, "departureId") || null : null,
    arrivalDate: isGroup ? null : text(formData, "arrivalDate") || null,
    nights: isGroup ? 0 : Math.max(trip.minNights, Math.min(trip.maxNights, Number(formData.get("nights") ?? trip.minNights))),
    persons,
    levels,
    extraIds: formData.getAll("extraIds").map(String).filter((id) => trip.extras.some((e) => e.id === id)),
    flightRequested: !isGroup && formData.get("flightRequested") === "on",
    departureAirport: text(formData, "departureAirport"),
  };

  if (isGroup) {
    const dep = departures.find((d) => d.id === step1.departureId);
    if (!dep) fail(slug, 1, "Kies een vertrek.");
    if (dep.seatsLeft < persons) fail(slug, 1, `Voor dit vertrek zijn nog ${dep.seatsLeft} plekken beschikbaar.`);
  } else {
    if (!step1.arrivalDate || !isDateInSeason(step1.arrivalDate, pricing) || step1.arrivalDate < todayIso()) fail(slug, 1, "Kies een aankomstdatum binnen het seizoen.");
    if (step1.flightRequested && !step1.departureAirport) fail(slug, 1, "Vul je vertrekluchthaven in.");
  }
  try {
    calculateBreakdown(pricing, { departureId: step1.departureId, nights: step1.nights, persons, extraIds: step1.extraIds });
  } catch (e) {
    fail(slug, 1, e instanceof Error ? e.message : "Prijs kan niet worden berekend.");
  }

  const draft = await readCheckoutDraft(slug);
  // Niveau's uit stap 1 meenemen naar al ingevulde deelnemers.
  const step2 = draft.step2
    ? { ...draft.step2, participants: draft.step2.participants.slice(0, persons).map((p, i) => ({ ...p, level: levels[i] })) }
    : undefined;
  await writeCheckoutDraft({ slug, step1, step2 });
  redirect(`/boeken/${slug}?step=2`);
}

export async function saveStep2Action(slug: string, formData: FormData) {
  const draft = await readCheckoutDraft(slug);
  if (!draft.step1) redirect(`/boeken/${slug}?step=1`);

  const address: BookingAddress = {
    street: text(formData, "street"),
    houseNumber: text(formData, "houseNumber"),
    postalCode: text(formData, "postalCode"),
    city: text(formData, "city"),
    country: text(formData, "country"),
  };
  const participants = participantsFromForm(formData).map((p, i) => ({ ...p, level: draft.step1!.levels[i] ?? p.level }));
  const step2: CheckoutStep2 = {
    contactName: text(formData, "contactName"),
    contactEmail: text(formData, "contactEmail").toLowerCase(),
    contactPhone: text(formData, "contactPhone"),
    address,
    participants,
  };
  if (!step2.contactName || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(step2.contactEmail) || !step2.contactPhone) fail(slug, 2, "Vul naam, e-mailadres en telefoonnummer in.");
  if (Object.values(address).some((v) => !v)) fail(slug, 2, "Vul je volledige adres in.");
  if (participants.length !== draft.step1.persons || participants.some((p) => !p.firstName || !p.lastName)) {
    fail(slug, 2, `Vul voor alle ${draft.step1.persons} reizigers voor- en achternaam in.`);
  }

  await writeCheckoutDraft({ ...draft, step2 });
  redirect(`/boeken/${slug}?step=3`);
}

export async function payAction(slug: string, formData: FormData) {
  const draft = await readCheckoutDraft(slug);
  if (!draft.step1) redirect(`/boeken/${slug}?step=1`);
  if (!draft.step2) redirect(`/boeken/${slug}?step=2`);
  const { step1, step2 } = draft;

  if (formData.get("acceptTerms") !== "on") fail(slug, 3, "Vink aan dat je akkoord gaat met de algemene voorwaarden.");
  if (formData.get("acceptCancellation") !== "on") fail(slug, 3, "Vink aan dat je de annuleringsvoorwaarden van deze reis hebt gelezen.");
  if (!isMollieConfigured()) fail(slug, 3, "Betalen is op dit moment niet mogelijk. Bel ons om te boeken.");
  const botError = await verifyTurnstile(formData);
  if (botError) fail(slug, 3, botError);

  const [trip, settings] = await Promise.all([getTripBySlug(slug), getSiteSettings()]);
  if (!trip) redirect(`/reizen/${slug}`);
  const isGroup = trip.type === "group";
  const departures = isGroup ? await getOpenDeparturesWithAvailability(trip.id, trip.departures) : [];
  const pricing = pricingTripFrom(trip, departures);
  const departure = isGroup ? departures.find((d) => d.id === step1.departureId) : undefined;
  if (isGroup && (!departure || departure.seatsLeft < step1.persons)) fail(slug, 1, "Dit vertrek is inmiddels niet meer beschikbaar voor dit aantal personen.");

  // Prijs opnieuw berekenen op de server met dezelfde functie als de reispagina en stap 1.
  let breakdown;
  try {
    breakdown = calculateBreakdown(pricing, { departureId: step1.departureId, nights: step1.nights, persons: step1.persons, extraIds: step1.extraIds });
  } catch (e) {
    fail(slug, 1, e instanceof Error ? e.message : "Prijs kan niet worden berekend.");
  }
  const now = new Date();
  const arrivalDate = isGroup ? departure!.departureDate : new Date(`${step1.arrivalDate}T00:00:00Z`);
  const nights = isGroup ? Math.max(1, Math.round((departure!.returnDate.getTime() - departure!.departureDate.getTime()) / 86_400_000)) : step1.nights;

  const booking = await createBooking({
    tripId: trip.id,
    departureId: departure?.id ?? null,
    arrivalDate,
    nights,
    flightRequested: step1.flightRequested,
    departureAirport: step1.flightRequested ? step1.departureAirport : null,
    extras: step1.extraIds.map((id) => {
      const e = trip.extras.find((x) => x.id === id)!;
      return { extraId: e.id, name: e.name, pricePp: e.pricePp.toFixed(2), qty: step1.persons };
    }),
    contactName: step2.contactName,
    contactEmail: step2.contactEmail,
    contactPhone: step2.contactPhone,
    contactAddress: step2.address,
    priceBreakdown: breakdown.lines,
    totalAmount: breakdown.total,
    cancellationPolicySnapshot: parseCancellationPolicy(trip.partner.cancellationPolicy),
    termsAcceptedAt: now,
    cancellationTermsAcceptedAt: now,
    participants: step2.participants,
  });
  void settings;

  // De boeking bestaat nu; het concept mag weg, ook als Mollie zo faalt
  // (dan kan de klant vanaf de bevestigingspagina opnieuw betalen).
  await clearCheckoutDraft();
  let checkoutUrl: string;
  try {
    checkoutUrl = await createMolliePayment(booking);
  } catch (error) {
    console.error("Mollie-betaling aanmaken mislukt:", error);
    redirect(`/boeken/bevestiging/${booking.bookingNumber}?betaalfout=1`);
  }
  redirect(checkoutUrl);
}
