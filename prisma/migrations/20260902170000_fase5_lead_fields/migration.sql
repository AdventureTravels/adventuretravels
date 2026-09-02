-- Fase 5: velden voor groepsaanvragen en contactformulier op Lead.
ALTER TABLE "Lead"
ADD COLUMN "organization" TEXT,
ADD COLUMN "groupSize" TEXT,
ADD COLUMN "sport" TEXT,
ADD COLUMN "period" TEXT,
ADD COLUMN "subject" TEXT;
