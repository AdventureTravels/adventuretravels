import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getSiteSettings, updateSiteSettings } from "@/lib/content/settings";

export async function GET(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const data = await request.json();
  const settings = await updateSiteSettings(data);
  return NextResponse.json(settings);
}
