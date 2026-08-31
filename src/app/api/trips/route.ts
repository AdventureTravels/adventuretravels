import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getTrips, createTrip } from "@/lib/content/trips";

export async function GET(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const trips = await getTrips();
  return NextResponse.json(trips);
}

export async function POST(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const data = await request.json();
  const trip = await createTrip(data);
  return NextResponse.json(trip, { status: 201 });
}
