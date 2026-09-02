import { NextResponse } from "next/server";
import { isMollieConfigured, syncPaymentFromMollie } from "@/lib/mollie";

/**
 * Mollie roept deze URL aan bij elke statuswijziging, met alleen een `id`.
 * We vertrouwen de body nooit: de betaling wordt altijd bij Mollie opgehaald.
 * Idempotent: statusovergangen worden precies één keer verwerkt.
 */
export async function POST(request: Request) {
  if (!isMollieConfigured()) return NextResponse.json({ error: "Mollie not configured" }, { status: 503 });
  const form = await request.formData().catch(() => null);
  const id = String(form?.get("id") ?? "");
  if (!/^tr_[A-Za-z0-9]+$/.test(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  try {
    await syncPaymentFromMollie(id);
  } catch (error) {
    console.error(`Webhook ${id} mislukt:`, error);
    // 500 laat Mollie het later opnieuw proberen.
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
