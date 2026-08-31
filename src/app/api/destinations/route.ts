import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getDestinations, createDestination } from "@/lib/content/destinations";

export async function GET(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const destinations = await getDestinations();
  return NextResponse.json(destinations);
}

export async function POST(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const data = await request.json();
  const destination = await createDestination(data);
  return NextResponse.json(destination, { status: 201 });
}
