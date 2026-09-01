"use server";

import { revalidatePath } from "next/cache";
import {
  updateBookingRequestStatus,
  updateBookingPayment,
  setBookingParticipants,
  addInvoice,
  deleteInvoice,
  updateInvoiceStatus,
} from "@/lib/content/bookings";
import { indexedRowsInOrder } from "@/lib/adminFormSections";

export async function updateStatusAction(id: string, formData: FormData) {
  const status = String(formData.get("status") ?? "aangevraagd");
  await updateBookingRequestStatus(id, status);
  revalidatePath(`/staff/${id}`);
  revalidatePath("/staff");
}

export async function updatePaymentAction(id: string, formData: FormData) {
  await updateBookingPayment(id, {
    totalAmount: String(formData.get("totalAmount") ?? "").trim() || undefined,
    depositAmount: String(formData.get("depositAmount") ?? "").trim() || undefined,
    depositPaid: formData.get("depositPaid") === "on",
    balanceAmount: String(formData.get("balanceAmount") ?? "").trim() || undefined,
    balancePaid: formData.get("balancePaid") === "on",
    notes: String(formData.get("notes") ?? "").trim() || undefined,
  });
  revalidatePath(`/staff/${id}`);
  revalidatePath("/staff");
}

export async function updateParticipantsAction(id: string, formData: FormData) {
  const rows = indexedRowsInOrder(formData, "participants")
    .map((row) => ({ name: row.name?.trim() ?? "", birthdate: row.birthdate?.trim(), dietaryNotes: row.dietaryNotes?.trim() }))
    .filter((row) => row.name);
  await setBookingParticipants(id, rows);
  revalidatePath(`/staff/${id}`);
}

export async function addInvoiceAction(id: string, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const amount = String(formData.get("amount") ?? "").trim();
  const fileUrl = String(formData.get("fileUrl") ?? "").trim();
  if (!label || !amount) return;
  await addInvoice(id, { label, amount, fileUrl: fileUrl || undefined });
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
