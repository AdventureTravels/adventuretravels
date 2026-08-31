"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createDestination, updateDestination, deleteDestination } from "@/lib/content/destinations";

function fromForm(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    heroImage: String(formData.get("heroImage") ?? "").trim(),
    heroTitle: String(formData.get("heroTitle") ?? "").trim(),
    heroSubtitle: String(formData.get("heroSubtitle") ?? "").trim(),
    cardImage: String(formData.get("cardImage") ?? "").trim(),
    caption: String(formData.get("caption") ?? "").trim(),
    flightTime: String(formData.get("flightTime") ?? "").trim(),
    bestPeriod: String(formData.get("bestPeriod") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
  };
}

export async function createDestinationAction(formData: FormData) {
  await createDestination(fromForm(formData));
  revalidatePath("/admin/destinations");
  revalidatePath("/bestemmingen");
  redirect("/admin/destinations");
}

export async function updateDestinationAction(id: string, formData: FormData) {
  await updateDestination(id, fromForm(formData));
  revalidatePath("/admin/destinations");
  revalidatePath("/bestemmingen");
  redirect("/admin/destinations");
}

export async function deleteDestinationAction(id: string) {
  await deleteDestination(id);
  revalidatePath("/admin/destinations");
  revalidatePath("/bestemmingen");
}
