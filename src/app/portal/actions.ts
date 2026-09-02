"use server";

import { redirect } from "next/navigation";
import { requestMagicLink } from "@/lib/customerAuth";
import { verifyTurnstile } from "@/lib/turnstile";

export async function requestMagicLinkAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/");
  const botError = await verifyTurnstile(formData);
  if (botError) redirect(`/?error=${encodeURIComponent(botError)}`);

  try {
    await requestMagicLink(email);
  } catch (error) {
    console.error("Kon magic link niet versturen:", error);
  }

  redirect("/?verzonden=1");
}
