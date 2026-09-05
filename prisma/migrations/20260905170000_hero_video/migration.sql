-- Hero-video (mp4 in Vercel Blob), overal in de hero met de hero-foto als poster.
ALTER TABLE "SiteSettings" ADD COLUMN "heroVideoUrl" TEXT NOT NULL DEFAULT '';
