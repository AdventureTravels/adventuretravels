"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createTripType, updateTripType, deleteTripType } from "@/lib/content/tripTypes";

function fromForm(formData: FormData) {
  return {
    href: String(formData.get("href") ?? "").trim(),
    icon: String(formData.get("icon") ?? "wave"),
    title: String(formData.get("title") ?? "").trim(),
    meta: String(formData.get("meta") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
  };
}

export async function createTripTypeAction(formData: FormData) {
  await createTripType(fromForm(formData));
  revalidatePath("/admin/trip-types");
  revalidatePath("/");
  redirect("/admin/trip-types");
}

export async function updateTripTypeAction(id: string, formData: FormData) {
  await updateTripType(id, fromForm(formData));
  revalidatePath("/admin/trip-types");
  revalidatePath("/");
  redirect("/admin/trip-types");
}

export async function deleteTripTypeAction(id: string) {
  await deleteTripType(id);
  revalidatePath("/admin/trip-types");
  revalidatePath("/");
}
