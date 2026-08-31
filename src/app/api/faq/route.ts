import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getFaqItems, createFaqItem } from "@/lib/content/faq";

export async function GET(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const items = await getFaqItems();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const data = await request.json();
  const item = await createFaqItem(data);
  return NextResponse.json(item, { status: 201 });
}
