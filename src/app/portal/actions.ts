"use server";

import { redirect } from "next/navigation";
import { requestMagicLink } from "@/lib/customerAuth";

export async function requestMagicLinkAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/");

  try {
    await requestMagicLink(email);
  } catch (error) {
    console.error("Kon magic link niet versturen:", error);
  }

  redirect("/?verzonden=1");
}
