-- Eigen tekst per categorie op /sporten/[slug]; leeg = het blok rendert niet.
-- Tot nu toe stond hier wakeboard-specifieke tekst hardcoded in de code.
ALTER TABLE "Sport" ADD COLUMN "forWhoBody" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Sport" ADD COLUMN "expectBody" TEXT NOT NULL DEFAULT '';
