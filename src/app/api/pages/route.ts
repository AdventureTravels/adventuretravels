import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getPages } from "@/lib/content/pages";

export async function GET(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const pages = await getPages();
  return NextResponse.json(pages);
}
