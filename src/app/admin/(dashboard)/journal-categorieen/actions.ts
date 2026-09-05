"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createArticleCategory, updateArticleCategory, deleteArticleCategory } from "@/lib/content/articles";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

function fromForm(formData: FormData) {
  return {
    slug: text(formData, "slug").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, ""),
    name: text(formData, "name"),
    description: text(formData, "description"),
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

function revalidate() {
  revalidatePath("/admin/journal-categorieen");
  revalidatePath("/journal", "layout");
}

export async function createArticleCategoryAction(formData: FormData) {
  const data = fromForm(formData);
  if (!data.slug || !data.name) redirect("/admin/journal-categorieen?error=Naam+en+slug+zijn+verplicht");
  await createArticleCategory(data);
  revalidate();
  redirect("/admin/journal-categorieen?saved=1");
}

export async function updateArticleCategoryAction(id: string, formData: FormData) {
  await updateArticleCategory(id, fromForm(formData));
  revalidate();
  redirect("/admin/journal-categorieen?saved=1");
}

export async function deleteArticleCategoryAction(id: string) {
  await deleteArticleCategory(id);
  revalidate();
  redirect("/admin/journal-categorieen");
}
