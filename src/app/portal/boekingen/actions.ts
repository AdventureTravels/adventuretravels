"use server";

import { redirect } from "next/navigation";
import { clearCustomerSessionCookie } from "@/lib/customerAuth";

export async function customerLogoutAction() {
  await clearCustomerSessionCookie();
  redirect("/");
}
