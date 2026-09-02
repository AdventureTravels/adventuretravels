"use server";

import { revalidatePath } from "next/cache";
import { getCustomerEmail } from "@/lib/customerAuth";
import { getBookingById, setBookingParticipants } from "@/lib/content/bookings";
import { participantsFromForm } from "@/lib/participantsForm";

export async function updateOwnParticipantsAction(id: string, formData: FormData) {
  const email = await getCustomerEmail();
  const booking = await getBookingById(id);
  if (!email || !booking || booking.contactEmail.toLowerCase() !== email.toLowerCase()) return;

  await setBookingParticipants(id, participantsFromForm(formData));
  revalidatePath(`/boekingen/${id}`);
}
