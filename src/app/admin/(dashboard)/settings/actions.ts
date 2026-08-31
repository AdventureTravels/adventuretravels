"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateSiteSettings } from "@/lib/content/settings";

export async function updateSiteSettingsAction(formData: FormData) {
  let trustStats;
  try {
    trustStats = JSON.parse(String(formData.get("trustStats") ?? "[]"));
  } catch {
    redirect("/admin/settings?error=json");
  }

  await updateSiteSettings({
    topbarTagline: String(formData.get("topbarTagline") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    heroEyebrow: String(formData.get("heroEyebrow") ?? "").trim(),
    heroHeading: String(formData.get("heroHeading") ?? "").trim(),
    heroSubheading: String(formData.get("heroSubheading") ?? "").trim(),
    trustStats,
    programCtaEyebrow: String(formData.get("programCtaEyebrow") ?? "").trim(),
    programCtaTitle: String(formData.get("programCtaTitle") ?? "").trim(),
    programCtaBody: String(formData.get("programCtaBody") ?? "").trim(),
    newsletterTitle: String(formData.get("newsletterTitle") ?? "").trim(),
    footerTagline: String(formData.get("footerTagline") ?? "").trim(),
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  redirect("/admin/settings?saved=1");
}
