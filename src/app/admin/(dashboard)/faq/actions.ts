"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createFaqItem, updateFaqItem, deleteFaqItem } from "@/lib/content/faq";

function fromForm(formData: FormData) {
  return {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
  };
}

export async function createFaqItemAction(formData: FormData) {
  await createFaqItem(fromForm(formData));
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  redirect("/admin/faq");
}

export async function updateFaqItemAction(id: string, formData: FormData) {
  await updateFaqItem(id, fromForm(formData));
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  redirect("/admin/faq");
}

export async function deleteFaqItemAction(id: string) {
  await deleteFaqItem(id);
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}
