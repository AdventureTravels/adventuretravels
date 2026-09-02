"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  updateBookingStatus,
  updateBookingNotes,
  setBookingParticipants,
  addInvoice,
  deleteInvoice,
  updateInvoiceStatus,
} from "@/lib/content/bookings";
import { isBookingStatus } from "@/lib/bookingStatus";
import { participantsFromForm } from "@/lib/participantsForm";

export async function updateStatusAction(id: string, formData: FormData) {
  const status = String(formData.get("status") ?? "");
  if (!isBookingStatus(status)) return;
  try {
    await updateBookingStatus(id, status);
  } catch (error) {
    redirect(`/staff/${id}?error=${encodeURIComponent(error instanceof Error ? error.message : "Status niet gewijzigd.")}`);
  }
  revalidatePath(`/staff/${id}`);
  revalidatePath("/staff");
}

export async function updateNotesAction(id: string, formData: FormData) {
  await updateBookingNotes(id, String(formData.get("notes") ?? "").trim() || null);
  revalidatePath(`/staff/${id}`);
}

export async function updateParticipantsAction(id: string, formData: FormData) {
  await setBookingParticipants(id, participantsFromForm(formData));
  revalidatePath(`/staff/${id}`);
}

export async function addInvoiceAction(id: string, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const amount = String(formData.get("amount") ?? "").trim().replace(",", ".");
  const fileUrl = String(formData.get("fileUrl") ?? "").trim();
  if (!label || !amount || !Number.isFinite(Number(amount))) return;
  await addInvoice(id, { label, amount: Number(amount).toFixed(2), fileUrl: fileUrl || undefined });
  revalidatePath(`/staff/${id}`);
}

export async function updateInvoiceStatusAction(id: string, bookingId: string, formData: FormData) {
  const status = String(formData.get("status") ?? "verzonden");
  await updateInvoiceStatus(id, status);
  revalidatePath(`/staff/${bookingId}`);
}

export async function deleteInvoiceAction(id: string, bookingId: string) {
  await deleteInvoice(id);
  revalidatePath(`/staff/${bookingId}`);
}
