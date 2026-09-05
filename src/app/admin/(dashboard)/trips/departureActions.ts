"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createDeparture, updateDeparture, deleteDeparture, createExtra, updateExtra, deleteExtra } from "@/lib/content/departures";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const money = (formData: FormData, key: string) => {
  const v = text(formData, key).replace(",", ".");
  return Number.isFinite(Number(v)) && v ? Number(v).toFixed(2) : null;
};
const date = (formData: FormData, key: string) => {
  const v = text(formData, key);
  return v ? new Date(`${v}T00:00:00Z`) : null;
};

function back(tripId: string, error?: string): never {
  redirect(`/admin/trips/${tripId}${error ? `?error=${encodeURIComponent(error)}` : "?saved=1"}#vertrekken`);
}

function revalidate(tripId: string) {
  revalidatePath(`/admin/trips/${tripId}`);
  revalidatePath("/", "layout");
}

function departureFromForm(tripId: string, formData: FormData) {
  const departureDate = date(formData, "departureDate");
  const returnDate = date(formData, "returnDate");
  const bookingDeadline = date(formData, "bookingDeadline");
  const pricePpAllIn = money(formData, "pricePpAllIn");
  const maxParticipants = Number(formData.get("maxParticipants"));
  const minParticipants = Number(formData.get("minParticipants"));
  if (!departureDate || !returnDate || !bookingDeadline) back(tripId, "Vul vertrek-, retour- en deadlinedatum in.");
  if (returnDate <= departureDate) back(tripId, "De retourdatum moet na de vertrekdatum liggen.");
  if (bookingDeadline > departureDate) back(tripId, "De boekingsdeadline moet vóór het vertrek liggen.");
  if (!pricePpAllIn) back(tripId, "Vul een all-in prijs per persoon in.");
  if (!Number.isInteger(maxParticipants) || maxParticipants < 1) back(tripId, "Maximum aantal deelnemers moet minstens 1 zijn.");
  if (!Number.isInteger(minParticipants) || minParticipants < 1 || minParticipants > maxParticipants) back(tripId, "Minimum deelnemers moet tussen 1 en het maximum liggen.");
  return {
    departureDate,
    returnDate,
    bookingDeadline,
    pricePpAllIn,
    maxParticipants,
    minParticipants,
    guideId: text(formData, "guideId") || null,
    status: text(formData, "status") || "open",
  };
}

export async function createDepartureAction(tripId: string, formData: FormData) {
  await createDeparture(tripId, departureFromForm(tripId, formData));
  revalidate(tripId);
  back(tripId);
}

export async function updateDepartureAction(tripId: string, id: string, formData: FormData) {
  await updateDeparture(id, departureFromForm(tripId, formData));
  revalidate(tripId);
  back(tripId);
}

export async function deleteDepartureAction(tripId: string, id: string) {
  try {
    await deleteDeparture(id);
  } catch {
    back(tripId, "Dit vertrek heeft boekingen en kan niet worden verwijderd; zet de status op geannuleerd.");
  }
  revalidate(tripId);
  back(tripId);
}

function extraFromForm(tripId: string, formData: FormData) {
  const pricePp = money(formData, "pricePp");
  const name = text(formData, "name");
  if (!name) back(tripId, "Vul een naam voor de extra in.");
  if (!pricePp) back(tripId, "Vul een prijs per persoon voor de extra in.");
  return {
    name,
    description: text(formData, "description") || null,
    pricePp,
    isPerNight: formData.get("isPerNight") === "on",
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

export async function createExtraAction(tripId: string, formData: FormData) {
  await createExtra(tripId, extraFromForm(tripId, formData));
  revalidate(tripId);
  back(tripId);
}

export async function updateExtraAction(tripId: string, id: string, formData: FormData) {
  await updateExtra(id, extraFromForm(tripId, formData));
  revalidate(tripId);
  back(tripId);
}

export async function deleteExtraAction(tripId: string, id: string) {
  await deleteExtra(id);
  revalidate(tripId);
  back(tripId);
}
