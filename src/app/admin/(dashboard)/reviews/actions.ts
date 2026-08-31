"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createReview, updateReview, deleteReview } from "@/lib/content/reviews";

function fromForm(formData: FormData) {
  return {
    stars: Number(formData.get("stars") ?? 5),
    quote: String(formData.get("quote") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
  };
}

export async function createReviewAction(formData: FormData) {
  await createReview(fromForm(formData));
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function updateReviewAction(id: string, formData: FormData) {
  await updateReview(id, fromForm(formData));
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function deleteReviewAction(id: string) {
  await deleteReview(id);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
