import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getPageBySlug, updatePage } from "@/lib/content/pages";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { slug } = await params;
  const existing = await getPageBySlug(slug);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = await request.json();
  const page = await updatePage(existing.id, { ...data, slug });
  return NextResponse.json(page);
}
