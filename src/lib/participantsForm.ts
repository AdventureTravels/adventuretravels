import { indexedRowsInOrder } from "@/lib/adminFormSections";
import type { ParticipantInput } from "@/lib/content/bookings";

/** Leest de rijen van ParticipantsEditor uit een FormData. */
export function participantsFromForm(formData: FormData): ParticipantInput[] {
  return indexedRowsInOrder(formData, "participants")
    .map((row) => ({
      firstName: row.firstName?.trim() ?? "",
      lastName: row.lastName?.trim() ?? "",
      birthdate: row.birthdate?.trim() || null,
      level: row.level?.trim() || null,
      dietaryNotes: row.dietaryNotes?.trim() || null,
    }))
    .filter((row) => row.firstName || row.lastName);
}
