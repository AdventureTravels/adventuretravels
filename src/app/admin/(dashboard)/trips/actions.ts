"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createTrip, updateTrip, deleteTrip } from "@/lib/content/trips";
import { indexedRowsInOrder } from "@/lib/adminFormSections";

function fromForm(formData: FormData) {
  const program = JSON.parse(String(formData.get("program") ?? "[]"));
  const gallery = indexedRowsInOrder(formData, "gallery")
    .map((row) => row.path?.trim())
    .filter((path): path is string => Boolean(path));
  const fixedDepartureDate = String(formData.get("fixedDepartureDate") ?? "").trim();

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    level: String(formData.get("level") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    text: String(formData.get("text") ?? "").trim(),
    duration: String(formData.get("duration") ?? "").trim(),
    date: String(formData.get("date") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    priceNote: String(formData.get("priceNote") ?? "").trim(),
    heroImage: String(formData.get("heroImage") ?? "").trim(),
    heroSubtitle: String(formData.get("heroSubtitle") ?? "").trim(),
    program,
    included: String(formData.get("included") ?? "").trim(),
    notIncluded: String(formData.get("notIncluded") ?? "").trim(),
    stayTitle: String(formData.get("stayTitle") ?? "").trim(),
    stayBody: String(formData.get("stayBody") ?? "").trim(),
    stayImage: String(formData.get("stayImage") ?? "").trim(),
    galleryImages: gallery,
    fixedDepartureDate: fixedDepartureDate || null,
    order: Number(formData.get("order") ?? 0),
    sportId: String(formData.get("sportId") ?? ""),
    destinationId: String(formData.get("destinationId") ?? ""),
  };
}

export async function createTripAction(formData: FormData) {
  const trip = await createTrip(fromForm(formData));
  revalidatePath("/admin/trips");
  revalidatePath("/reizen");
  revalidatePath("/");
  redirect(`/admin/trips/${trip.id}`);
}

export async function updateTripAction(id: string, formData: FormData) {
  await updateTrip(id, fromForm(formData));
  revalidatePath("/admin/trips");
  revalidatePath("/reizen");
  revalidatePath("/");
  redirect("/admin/trips");
}

export async function deleteTripAction(id: string) {
  await deleteTrip(id);
  revalidatePath("/admin/trips");
  revalidatePath("/reizen");
  revalidatePath("/");
}
