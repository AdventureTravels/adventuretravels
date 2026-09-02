"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createGuide, updateGuide, deleteGuide } from "@/lib/content/guides";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

function fromForm(formData: FormData) {
  return {
    name: text(formData, "name"),
    bio: text(formData, "bio"),
    photo: text(formData, "photo"),
    photoAlt: text(formData, "photoAlt"),
    phone: text(formData, "phone"),
    livesIn: text(formData, "livesIn"),
    sports: text(formData, "sports").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
  };
}

function revalidate() {
  revalidatePath("/admin/guides");
  revalidatePath("/", "layout");
}

export async function createGuideAction(formData: FormData) {
  const guide = await createGuide(fromForm(formData));
  revalidate();
  redirect(`/admin/guides/${guide.id}?saved=1`);
}

export async function updateGuideAction(id: string, formData: FormData) {
  await updateGuide(id, fromForm(formData));
  revalidate();
  redirect(`/admin/guides/${id}?saved=1`);
}

export async function deleteGuideAction(id: string) {
  await deleteGuide(id);
  revalidate();
  redirect("/admin/guides");
}
