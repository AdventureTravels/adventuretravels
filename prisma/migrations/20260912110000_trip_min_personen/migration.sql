-- Minimale bezetting per reis (bv. een bungalow die per 2 personen wordt verhuurd).
-- Standaard 1: bestaande reizen veranderen niet.
ALTER TABLE "Trip" ADD COLUMN "minPersons" INTEGER NOT NULL DEFAULT 1;
