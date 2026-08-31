import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getSports, createSport } from "@/lib/content/sports";

export async function GET(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const sports = await getSports();
  return NextResponse.json(sports);
}

export async function POST(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const data = await request.json();
  const sport = await createSport(data);
  return NextResponse.json(sport, { status: 201 });
}
