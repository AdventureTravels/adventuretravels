"use server";

import { revalidatePath } from "next/cache";
import { updateBookingRequestStatus, deleteBookingRequest } from "@/lib/content/bookings";

export async function updateBookingStatusAction(id: string, formData: FormData) {
  const status = String(formData.get("status") ?? "new");
  await updateBookingRequestStatus(id, status);
  revalidatePath("/admin/bookings");
}

export async function deleteBookingRequestAction(id: string) {
  await deleteBookingRequest(id);
  revalidatePath("/admin/bookings");
}
