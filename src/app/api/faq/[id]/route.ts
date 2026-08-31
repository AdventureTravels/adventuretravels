import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getFaqItemById, updateFaqItem, deleteFaqItem } from "@/lib/content/faq";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const item = await getFaqItemById(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const data = await request.json();
  const item = await updateFaqItem(id, data);
  return NextResponse.json(item);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await deleteFaqItem(id);
  return NextResponse.json({ ok: true });
}
