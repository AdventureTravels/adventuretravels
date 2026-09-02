import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getApprovedReviews } from "@/lib/content/reviews";

/** Alleen lezen: reviews ontstaan uitsluitend via de reviewflow na een reis. */
export async function GET(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const reviews = await getApprovedReviews();
  return NextResponse.json(reviews);
}
