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

/** Boekingsbeheer wordt gedeeld door het staff-portaal (/staff) en de admin (/admin/bookings). */
export type BookingBasePath = "/staff" | "/admin/bookings";

function revalidate(basePath: BookingBasePath, id: string) {
  for (const base of ["/staff", "/admin/bookings"] as const) {
    revalidatePath(`${base}/${id}`);
    revalidatePath(base);
  }
  void basePath;
}

export async function updateStatusAction(basePath: BookingBasePath, id: string, formData: FormData) {
  const status = String(formData.get("status") ?? "");
  if (!isBookingStatus(status)) return;
  try {
    await updateBookingStatus(id, status);
  } catch (error) {
    redirect(`${basePath}/${id}?error=${encodeURIComponent(error instanceof Error ? error.message : "Status niet gewijzigd.")}`);
  }
  revalidate(basePath, id);
}

export async function updateNotesAction(basePath: BookingBasePath, id: string, formData: FormData) {
  await updateBookingNotes(id, String(formData.get("notes") ?? "").trim() || null);
  revalidate(basePath, id);
}

export async function updateParticipantsAction(basePath: BookingBasePath, id: string, formData: FormData) {
  await setBookingParticipants(id, participantsFromForm(formData));
  revalidate(basePath, id);
}

export async function addInvoiceAction(basePath: BookingBasePath, id: string, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const amount = String(formData.get("amount") ?? "").trim().replace(",", ".");
  const fileUrl = String(formData.get("fileUrl") ?? "").trim();
  if (!label || !amount || !Number.isFinite(Number(amount))) return;
  await addInvoice(id, { label, amount: Number(amount).toFixed(2), fileUrl: fileUrl || undefined });
  revalidate(basePath, id);
}

export async function updateInvoiceStatusAction(basePath: BookingBasePath, id: string, bookingId: string, formData: FormData) {
  const status = String(formData.get("status") ?? "verzonden");
  await updateInvoiceStatus(id, status);
  revalidate(basePath, bookingId);
}

export async function deleteInvoiceAction(basePath: BookingBasePath, id: string, bookingId: string) {
  await deleteInvoice(id);
  revalidate(basePath, bookingId);
}
