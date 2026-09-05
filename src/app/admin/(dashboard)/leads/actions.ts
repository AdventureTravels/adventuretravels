"use server";

import { revalidatePath } from "next/cache";
import { setLeadHandled, deleteLead } from "@/lib/content/leads";

export async function setLeadHandledAction(id: string, handled: boolean) {
  await setLeadHandled(id, handled);
  revalidatePath("/admin/leads");
}

export async function deleteLeadAction(id: string) {
  await deleteLead(id);
  revalidatePath("/admin/leads");
}
