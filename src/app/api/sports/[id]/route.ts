import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getSportById, updateSport, deleteSport } from "@/lib/content/sports";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const sport = await getSportById(id);
  if (!sport) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(sport);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const data = await request.json();
  const sport = await updateSport(id, data);
  return NextResponse.json(sport);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await deleteSport(id);
  return NextResponse.json({ ok: true });
}
