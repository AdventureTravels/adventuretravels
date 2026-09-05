-- Fase 7: icoon per sport (nieuwe sport zonder code) en afhandelmarkering op leads.
ALTER TABLE "Sport" ADD COLUMN "icon" TEXT NOT NULL DEFAULT 'wave';
ALTER TABLE "Lead" ADD COLUMN "handledAt" TIMESTAMP(3);
