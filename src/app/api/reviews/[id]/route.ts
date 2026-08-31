import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getReviewById, updateReview, deleteReview } from "@/lib/content/reviews";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const review = await getReviewById(id);
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(review);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const data = await request.json();
  const review = await updateReview(id, data);
  return NextResponse.json(review);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await deleteReview(id);
  return NextResponse.json({ ok: true });
}
