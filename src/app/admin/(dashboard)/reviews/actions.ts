"use server";

import { revalidatePath } from "next/cache";
import { setReviewStatus, deleteReview } from "@/lib/content/reviews";

export async function setReviewStatusAction(id: string, status: "approved" | "rejected") {
  await setReviewStatus(id, status);
  revalidatePath("/admin/reviews");
  revalidatePath("/", "layout");
}

export async function deleteReviewAction(id: string) {
  await deleteReview(id);
  revalidatePath("/admin/reviews");
  revalidatePath("/", "layout");
}
