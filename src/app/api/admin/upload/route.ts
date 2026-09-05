import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { getSessionEmail } from "@/lib/auth";
import { hasBlobStorage } from "@/lib/blob";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 8 * 1024 * 1024;
// Video alleen via deze route als er geen Blob-opslag is (lokaal, naar
// public/uploads); op Vercel gaat video via /api/admin/upload-video.
const MAX_VIDEO_SIZE = 60 * 1024 * 1024;
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
  "video/mp4": "mp4",
};

export async function POST(request: Request) {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Geen bestand ontvangen" }, { status: 400 });
  }

  const ext = MIME_EXT[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Ongeldig bestandstype. Gebruik JPG, PNG, WEBP, GIF, SVG, PDF of MP4." }, { status: 400 });
  }
  const isVideo = file.type === "video/mp4";
  if (isVideo && hasBlobStorage()) {
    return NextResponse.json({ error: "Upload video via de video-uploader (rechtstreeks naar Blob)." }, { status: 400 });
  }
  if (file.size > (isVideo ? MAX_VIDEO_SIZE : MAX_SIZE)) {
    return NextResponse.json({ error: `Bestand is groter dan ${isVideo ? 60 : 8}MB.` }, { status: 400 });
  }

  const filename = `${randomUUID()}.${ext}`;

  // Op Vercel is het bestandssysteem read-only/vluchtig: uploads gaan naar Blob
  // (token óf OIDC, zie lib/blob.ts).
  if (hasBlobStorage()) {
    const blob = await put(`uploads/${filename}`, file, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ path: blob.url });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ path: `/uploads/${filename}` });
}
