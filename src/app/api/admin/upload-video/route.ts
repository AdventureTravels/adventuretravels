import { NextResponse } from "next/server";
import { issueSignedToken } from "@vercel/blob";
import {
  handleUpload,
  handleUploadPresigned,
  type HandleUploadBody,
  type HandleUploadPresignedBody,
} from "@vercel/blob/client";
import { getSessionEmail } from "@/lib/auth";
import { blobMode } from "@/lib/blob";

/**
 * Client-side upload naar Vercel Blob voor grote bestanden (hero-video).
 * De browser uploadt rechtstreeks naar Blob; deze route geeft alleen een
 * kortlevend upload-token of presigned URL uit en omzeilt zo de 4,5 MB
 * request-limiet van Vercel Functions.
 *
 * - BLOB_READ_WRITE_TOKEN aanwezig: klassieke client-token-flow (handleUpload).
 * - Alleen BLOB_STORE_ID (OIDC-koppeling): presigned-flow (handleUploadPresigned
 *   + issueSignedToken). Zo is de store van adventuretravels gekoppeld.
 * - Geen van beide (lokaal): GET meldt "local"; de admin valt terug op
 *   /api/admin/upload naar public/uploads.
 */
const MAX_VIDEO_BYTES = 60 * 1024 * 1024;
const VIDEO_CONTENT_TYPES = ["video/mp4"];
const TOKEN_TTL_MS = 15 * 60 * 1000;

function isAllowedPath(pathname: string) {
  return pathname.startsWith("uploads/") && pathname.endsWith(".mp4") && !pathname.includes("..");
}

export async function GET() {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ mode: blobMode() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody | HandleUploadPresignedBody;

  // Alleen een ingelogde admin mag een upload-token/presigned URL krijgen. De
  // "upload-completed"-callback komt van Vercel Blob zelf (zonder sessie) en
  // doet hier niets: de admin slaat de URL op via het instellingenformulier.
  if (body.type !== "blob.upload-completed") {
    const email = await getSessionEmail();
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode = blobMode();
  if (mode === "local") {
    return NextResponse.json({ error: "Blob-opslag is niet geconfigureerd" }, { status: 501 });
  }

  try {
    if (mode === "token") {
      const result = await handleUpload({
        request,
        body: body as HandleUploadBody,
        onBeforeGenerateToken: async (pathname) => {
          if (!isAllowedPath(pathname)) throw new Error("Ongeldig pad");
          return {
            allowedContentTypes: VIDEO_CONTENT_TYPES,
            maximumSizeInBytes: MAX_VIDEO_BYTES,
            addRandomSuffix: false,
            validUntil: Date.now() + TOKEN_TTL_MS,
          };
        },
        onUploadCompleted: async () => {},
      });
      return NextResponse.json(result);
    }

    const result = await handleUploadPresigned({
      request,
      body: body as HandleUploadPresignedBody,
      getSignedToken: async (pathname) => {
        if (!isAllowedPath(pathname)) throw new Error("Ongeldig pad");
        const validUntil = Date.now() + TOKEN_TTL_MS;
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes: VIDEO_CONTENT_TYPES,
          maximumSizeInBytes: MAX_VIDEO_BYTES,
          validUntil,
        });
        return {
          token,
          urlOptions: {
            validUntil,
            allowedContentTypes: VIDEO_CONTENT_TYPES,
            maximumSizeInBytes: MAX_VIDEO_BYTES,
            addRandomSuffix: false,
          },
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error("upload-video:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload mislukt" }, { status: 400 });
  }
}
