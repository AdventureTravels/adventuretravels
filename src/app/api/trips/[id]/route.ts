import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getTripById, updateTrip, deleteTrip } from "@/lib/content/trips";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const trip = await getTripById(id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(trip);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const data = await request.json();
  const trip = await updateTrip(id, data);
  return NextResponse.json(trip);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await deleteTrip(id);
  return NextResponse.json({ ok: true });
}
