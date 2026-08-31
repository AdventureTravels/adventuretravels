import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getReviews, createReview } from "@/lib/content/reviews";

export async function GET(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const reviews = await getReviews();
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const data = await request.json();
  const review = await createReview(data);
  return NextResponse.json(review, { status: 201 });
}
