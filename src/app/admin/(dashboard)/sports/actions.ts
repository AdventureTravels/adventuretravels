"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSport, updateSport, deleteSport, setSportMailerliteGroupId } from "@/lib/content/sports";
import { findOrCreateGroup, isMailerLiteConfigured } from "@/lib/mailerlite";

function fromForm(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    heroImage: String(formData.get("heroImage") ?? "").trim(),
    heroTitle: String(formData.get("heroTitle") ?? "").trim(),
    heroSubtitle: String(formData.get("heroSubtitle") ?? "").trim(),
    cardImage: String(formData.get("cardImage") ?? "").trim(),
    caption: String(formData.get("caption") ?? "").trim(),
    icon: String(formData.get("icon") ?? "wave").trim() || "wave",
    order: Number(formData.get("order") ?? 0),
  };
}

async function ensureMailerliteGroup(sportId: string, sportName: string) {
  if (!isMailerLiteConfigured()) return;
  try {
    const groupId = await findOrCreateGroup(sportName);
    await setSportMailerliteGroupId(sportId, groupId);
  } catch (error) {
    console.error("MailerLite group sync failed:", error);
  }
}

export async function createSportAction(formData: FormData) {
  const data = fromForm(formData);
  const sport = await createSport(data);
  await ensureMailerliteGroup(sport.id, sport.name);
  revalidatePath("/admin/sports");
  revalidatePath("/", "layout");
  redirect("/admin/sports");
}

export async function updateSportAction(id: string, formData: FormData) {
  const data = fromForm(formData);
  await updateSport(id, data);
  await ensureMailerliteGroup(id, data.name);
  revalidatePath("/admin/sports");
  revalidatePath("/", "layout");
  redirect("/admin/sports");
}

export async function deleteSportAction(id: string) {
  await deleteSport(id);
  revalidatePath("/admin/sports");
  revalidatePath("/", "layout");
}
