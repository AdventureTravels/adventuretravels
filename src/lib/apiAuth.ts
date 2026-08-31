import { NextResponse } from "next/server";

export function requireApiKey(request: Request): NextResponse | null {
  const expected = process.env.API_KEY;
  const header = request.headers.get("authorization");
  const provided = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!expected || !provided || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
