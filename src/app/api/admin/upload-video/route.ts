import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionEmail } from "@/lib/auth";

/**
 * Client-side upload naar Vercel Blob voor grote bestanden (hero-video).
 * De browser uploadt rechtstreeks naar Blob; deze route geeft alleen een
 * kortlevend upload-token uit (en omzeilt zo de 4,5 MB request-limiet van
 * Vercel Functions). Zonder BLOB_READ_WRITE_TOKEN (lokaal) meldt GET dat en
 * valt de admin terug op /api/admin/upload naar public/uploads.
 */
const MAX_VIDEO_BYTES = 60 * 1024 * 1024;
const VIDEO_CONTENT_TYPES = ["video/mp4"];

export async function GET() {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ clientUploads: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
}

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  // Alleen een ingelogde admin mag een upload-token krijgen. De
  // "upload-completed"-callback komt van Vercel Blob zelf (zonder sessie) en
  // doet hier niets: de admin slaat de URL op via het instellingenformulier.
  if (body.type === "blob.generate-client-token") {
    const email = await getSessionEmail();
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blob-opslag is niet geconfigureerd" }, { status: 501 });
  }

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("uploads/") || !pathname.endsWith(".mp4")) {
          throw new Error("Ongeldig pad");
        }
        return {
          allowedContentTypes: VIDEO_CONTENT_TYPES,
          maximumSizeInBytes: MAX_VIDEO_BYTES,
          addRandomSuffix: false,
          validUntil: Date.now() + 15 * 60 * 1000,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload mislukt" }, { status: 400 });
  }
}
