-- Fase 4: betaalherinnering per boeking (cron), zodat die precies één keer gaat.
ALTER TABLE "Booking" ADD COLUMN "reminderSentAt" TIMESTAMP(3);
