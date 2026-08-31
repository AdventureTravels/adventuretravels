import { NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getArticles, createArticle } from "@/lib/content/articles";

export async function GET(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const articles = await getArticles();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const data = await request.json();
  const article = await createArticle(data);
  return NextResponse.json(article, { status: 201 });
}
