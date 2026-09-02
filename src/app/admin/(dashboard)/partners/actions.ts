"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createPartner, updatePartner, deletePartner } from "@/lib/content/partners";
import { validateCancellationPolicy, type CancellationTier } from "@/lib/cancellation";
import { indexedRowsInOrder } from "@/lib/adminFormSections";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

function fromForm(formData: FormData) {
  const policy: CancellationTier[] = indexedRowsInOrder(formData, "policy").map((row) => ({
    daysBefore: Number(row.daysBefore),
    pct: Number(row.pct),
  }));
  const error = validateCancellationPolicy(policy);
  const commission = text(formData, "commissionPct").replace(",", ".");
  return {
    error,
    data: {
      slug: text(formData, "slug"),
      name: text(formData, "name"),
      type: text(formData, "type") || "park",
      country: text(formData, "country"),
      city: text(formData, "city"),
      contactName: text(formData, "contactName") || null,
      contactEmail: text(formData, "contactEmail") || null,
      contactPhone: text(formData, "contactPhone") || null,
      commissionPct: commission ? Number(commission).toFixed(2) : null,
      cancellationPolicy: policy,
      cancellationNotes: text(formData, "cancellationNotes") || null,
      // Zonder geldige staffel kan een partner niet actief zijn.
      isActive: formData.get("isActive") === "on" && error === null,
    },
  };
}

function revalidate() {
  revalidatePath("/admin/partners");
  revalidatePath("/", "layout");
}

export async function createPartnerAction(formData: FormData) {
  const { error, data } = fromForm(formData);
  const partner = await createPartner(data);
  revalidate();
  redirect(`/admin/partners/${partner.id}${error ? `?error=${encodeURIComponent(error)}` : "?saved=1"}`);
}

export async function updatePartnerAction(id: string, formData: FormData) {
  const { error, data } = fromForm(formData);
  await updatePartner(id, data);
  revalidate();
  redirect(`/admin/partners/${id}${error ? `?error=${encodeURIComponent(error)}` : "?saved=1"}`);
}

export async function deletePartnerAction(id: string) {
  await deletePartner(id);
  revalidate();
}
