"use server";

import { revalidatePath } from "next/cache";
import { getCustomerEmail } from "@/lib/customerAuth";
import { getBookingRequestById, setBookingParticipants } from "@/lib/content/bookings";
import { indexedRowsInOrder } from "@/lib/adminFormSections";

export async function updateOwnParticipantsAction(id: string, formData: FormData) {
  const email = await getCustomerEmail();
  const booking = await getBookingRequestById(id);
  if (!email || !booking || booking.email.toLowerCase() !== email.toLowerCase()) return;

  const rows = indexedRowsInOrder(formData, "participants")
    .map((row) => ({ name: row.name?.trim() ?? "", birthdate: row.birthdate?.trim(), dietaryNotes: row.dietaryNotes?.trim() }))
    .filter((row) => row.name);
  await setBookingParticipants(id, rows);
  revalidatePath(`/boekingen/${id}`);
}
