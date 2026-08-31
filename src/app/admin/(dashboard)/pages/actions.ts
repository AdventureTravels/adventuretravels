"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updatePage, getPageById } from "@/lib/content/pages";
import type { PageSection } from "@/lib/content/pages";
import { indexedRowsInOrder } from "@/lib/adminFormSections";

export async function updatePageAction(id: string, formData: FormData) {
  const page = await getPageById(id);
  if (!page) redirect("/admin/pages");

  let sections: PageSection[];
  let extra: unknown;
  try {
    sections = indexedRowsInOrder(formData, "sections").map((row) => {
      const kind = row.kind && row.kind !== "text" ? (row.kind as PageSection["kind"]) : undefined;
      return {
        title: row.title ?? "",
        bodyHtml: row.bodyHtml ?? "",
        kind,
        data: kind && row.data?.trim() ? JSON.parse(row.data) : undefined,
      };
    });
    const extraRaw = String(formData.get("extra") ?? "").trim();
    extra = extraRaw ? JSON.parse(extraRaw) : undefined;
  } catch {
    redirect(`/admin/pages/${id}?error=json`);
  }

  await updatePage(id, {
    slug: page.slug,
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    sections,
    extra,
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/${page.slug}`);
  redirect(`/admin/pages/${id}?saved=1`);
}
