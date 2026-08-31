"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createIncludedItem, updateIncludedItem, deleteIncludedItem } from "@/lib/content/includedItems";

function fromForm(formData: FormData) {
  return {
    icon: String(formData.get("icon") ?? "wave"),
    title: String(formData.get("title") ?? "").trim(),
    bodyHtml: String(formData.get("bodyHtml") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
  };
}

export async function createIncludedItemAction(formData: FormData) {
  await createIncludedItem(fromForm(formData));
  revalidatePath("/admin/included");
  revalidatePath("/");
  redirect("/admin/included");
}

export async function updateIncludedItemAction(id: string, formData: FormData) {
  await updateIncludedItem(id, fromForm(formData));
  revalidatePath("/admin/included");
  revalidatePath("/");
  redirect("/admin/included");
}

export async function deleteIncludedItemAction(id: string) {
  await deleteIncludedItem(id);
  revalidatePath("/admin/included");
  revalidatePath("/");
}
