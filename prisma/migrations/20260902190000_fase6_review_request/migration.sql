-- Fase 6: reviewmail precies één keer per boeking.
ALTER TABLE "Booking" ADD COLUMN "reviewRequestedAt" TIMESTAMP(3);
