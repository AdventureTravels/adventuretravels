"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createTrip, updateTrip, deleteTrip } from "@/lib/content/trips";
import { indexedRowsInOrder } from "@/lib/adminFormSections";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const lines = (formData: FormData, key: string) =>
  text(formData, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
const money = (formData: FormData, key: string) => {
  const v = text(formData, key).replace(",", ".");
  return v ? Number(v).toFixed(2) : null;
};

function fromForm(formData: FormData) {
  const program = JSON.parse(text(formData, "program") || "[]");
  const gallery = indexedRowsInOrder(formData, "gallery")
    .map((row) => ({ src: row.src?.trim() ?? "", alt: row.alt?.trim() ?? "" }))
    .filter((img) => img.src);

  return {
    slug: text(formData, "slug"),
    title: text(formData, "title"),
    type: text(formData, "type") || "individual",
    status: text(formData, "status") || "draft",
    level: text(formData, "level") || "all",
    image: text(formData, "image"),
    imageAlt: text(formData, "imageAlt"),
    text: text(formData, "text"),
    heroImage: text(formData, "heroImage"),
    heroImageAlt: text(formData, "heroImageAlt"),
    heroSubtitle: text(formData, "heroSubtitle"),
    program,
    stayTitle: text(formData, "stayTitle") || "Het verblijf",
    stayBody: text(formData, "stayBody"),
    stayImage: text(formData, "stayImage"),
    stayImageAlt: text(formData, "stayImageAlt"),
    galleryImages: gallery,
    includes: lines(formData, "includes"),
    excludes: lines(formData, "excludes"),
    order: Number(formData.get("order") ?? 0),
    seasonStartMonth: Number(formData.get("seasonStartMonth") ?? 1),
    seasonEndMonth: Number(formData.get("seasonEndMonth") ?? 12),
    minNights: Math.max(1, Number(formData.get("minNights") ?? 7)),
    maxNights: Math.max(1, Number(formData.get("maxNights") ?? 7)),
    pricePpBase: money(formData, "pricePpBase"),
    pricePerExtraNight: money(formData, "pricePerExtraNight"),
    sportId: text(formData, "sportId"),
    destinationId: text(formData, "destinationId"),
    partnerId: text(formData, "partnerId"),
    guideId: text(formData, "guideId") || null,
  };
}

function revalidate() {
  revalidatePath("/admin/trips");
  revalidatePath("/", "layout");
}

export async function createTripAction(formData: FormData) {
  const trip = await createTrip(fromForm(formData));
  revalidate();
  redirect(`/admin/trips/${trip.id}`);
}

export async function updateTripAction(id: string, formData: FormData) {
  await updateTrip(id, fromForm(formData));
  revalidate();
  redirect(`/admin/trips/${id}?saved=1`);
}

export async function deleteTripAction(id: string) {
  await deleteTrip(id);
  revalidate();
}
