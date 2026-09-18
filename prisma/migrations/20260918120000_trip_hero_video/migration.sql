-- Eigen hero-video per reis. Leeg = de sitebrede video uit SiteSettings (of alleen de foto).
ALTER TABLE "Trip" ADD COLUMN "heroVideoUrl" TEXT NOT NULL DEFAULT '';
