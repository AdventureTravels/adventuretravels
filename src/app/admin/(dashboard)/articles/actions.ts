"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createArticle, updateArticle, deleteArticle } from "@/lib/content/articles";
import type { ArticleSection } from "@/lib/content/articles";
import { indexedRowsInOrder } from "@/lib/adminFormSections";

function fromForm(formData: FormData) {
  const sections: ArticleSection[] = indexedRowsInOrder(formData, "sections").map((row) => ({
    title: row.title ?? "",
    bodyHtml: row.bodyHtml ?? "",
    number: row.number?.trim() || undefined,
    quoteHtml: row.quoteHtml?.trim() || undefined,
  }));
  const calloutLabel = String(formData.get("calloutLabel") ?? "").trim();
  const calloutText = String(formData.get("calloutText") ?? "").trim();
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    tag: String(formData.get("tag") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    heroImage: String(formData.get("heroImage") ?? "").trim(),
    intro: String(formData.get("intro") ?? "").trim(),
    sections,
    calloutLabel: calloutLabel || null,
    calloutText: calloutText || null,
    publishedAt: String(formData.get("publishedAt") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
  };
}

export async function createArticleAction(formData: FormData) {
  await createArticle(fromForm(formData));
  revalidatePath("/admin/articles");
  revalidatePath("/journal");
  redirect("/admin/articles");
}

export async function updateArticleAction(id: string, formData: FormData) {
  await updateArticle(id, fromForm(formData));
  revalidatePath("/admin/articles");
  revalidatePath("/journal");
  redirect("/admin/articles");
}

export async function deleteArticleAction(id: string) {
  await deleteArticle(id);
  revalidatePath("/admin/articles");
  revalidatePath("/journal");
}
