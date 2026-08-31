import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getDestinationById, updateDestination, deleteDestination } from "@/lib/content/destinations";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const destination = await getDestinationById(id);
  if (!destination) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(destination);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const data = await request.json();
  const destination = await updateDestination(id, data);
  return NextResponse.json(destination);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await deleteDestination(id);
  return NextResponse.json({ ok: true });
}
