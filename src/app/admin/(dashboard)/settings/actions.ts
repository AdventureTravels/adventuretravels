"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateSiteSettings } from "@/lib/content/settings";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function updateSiteSettingsAction(formData: FormData) {
  const usps = [text(formData, "usp0"), text(formData, "usp1"), text(formData, "usp2")].filter(Boolean);

  await updateSiteSettings({
    topbarTagline: text(formData, "topbarTagline"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    heroEyebrow: text(formData, "heroEyebrow"),
    heroHeading: text(formData, "heroHeading"),
    heroSubheading: text(formData, "heroSubheading"),
    heroImage: text(formData, "heroImage"),
    usps,
    dayImage: text(formData, "dayImage"),
    eveningImage: text(formData, "eveningImage"),
    programCtaEyebrow: text(formData, "programCtaEyebrow"),
    programCtaTitle: text(formData, "programCtaTitle"),
    programCtaBody: text(formData, "programCtaBody"),
    footerTagline: text(formData, "footerTagline"),
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}
