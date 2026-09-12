-- Vrije secties, FAQ, CTA-blok en SEO-velden per reis. Alles leeg by default:
-- bestaande reizen veranderen niet, een leeg veld rendert niet.
ALTER TABLE "Trip" ADD COLUMN "introBody" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Trip" ADD COLUMN "sections" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Trip" ADD COLUMN "faq" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Trip" ADD COLUMN "priceNote" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Trip" ADD COLUMN "ctaTitle" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Trip" ADD COLUMN "ctaBody" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Trip" ADD COLUMN "metaTitle" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Trip" ADD COLUMN "metaDescription" TEXT NOT NULL DEFAULT '';
