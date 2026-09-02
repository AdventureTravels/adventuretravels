-- Fase 2: datamodel v5.
-- Structuur volgt `prisma migrate diff`; daartussen de datamigratie van
-- BookingRequest → Booking (alle oude aanvragen als "cancelled"), Trip-velden
-- (rich text → arrays, prijsstring → Decimal, duur → nachten) en de eerste
-- partner (inactief, lege staffel: de reis blijft draft tot de staffel in
-- /admin is ingevuld).

-- ---------------------------------------------------------------------------
-- 1. Nieuwe tabellen
-- ---------------------------------------------------------------------------

CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "commissionPct" DECIMAL(5,2),
    "cancellationPolicy" JSONB NOT NULL,
    "cancellationNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photo" TEXT NOT NULL DEFAULT '',
    "photoAlt" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "livesIn" TEXT NOT NULL,
    "sports" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TripDeparture" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "pricePpAllIn" DECIMAL(10,2) NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "minParticipants" INTEGER NOT NULL,
    "bookingDeadline" TIMESTAMP(3) NOT NULL,
    "guideId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',

    CONSTRAINT "TripDeparture_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TripExtra" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pricePp" DECIMAL(10,2) NOT NULL,
    "isPerNight" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TripExtra_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "bookingNumber" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "departureId" TEXT,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "nights" INTEGER NOT NULL,
    "flightRequested" BOOLEAN NOT NULL DEFAULT false,
    "departureAirport" TEXT,
    "extras" JSONB NOT NULL DEFAULT '[]',
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL DEFAULT '',
    "contactAddress" JSONB NOT NULL DEFAULT '{}',
    "priceBreakdown" JSONB NOT NULL DEFAULT '[]',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_payment',
    "cancellationPolicySnapshot" JSONB NOT NULL DEFAULT '[]',
    "termsAcceptedAt" TIMESTAMP(3),
    "cancellationTermsAcceptedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "molliePaymentId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL,
    "method" TEXT,
    "paidAt" TIMESTAMP(3),
    "raw" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "tripId" TEXT,
    "preferredDay" TEXT,
    "preferredDaypart" TEXT,
    "message" TEXT,
    "newsletterOptIn" BOOLEAN NOT NULL DEFAULT false,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Partner_slug_key" ON "Partner"("slug");
CREATE UNIQUE INDEX "Booking_bookingNumber_key" ON "Booking"("bookingNumber");
CREATE UNIQUE INDEX "Payment_molliePaymentId_key" ON "Payment"("molliePaymentId");

-- ---------------------------------------------------------------------------
-- 2. Eerste partner (inactief, staffel leeg → reizen blijven draft)
-- ---------------------------------------------------------------------------

INSERT INTO "Partner" ("id", "slug", "name", "type", "country", "city", "commissionPct", "cancellationPolicy", "cancellationNotes", "isActive")
VALUES (
    'partner_hipnotics',
    'hipnotics-cable-park',
    'Hipnotics Cable Park',
    'park',
    'Turkije',
    'Antalya',
    15.00,
    '[]'::jsonb,
    'Een bijgeboekte vlucht valt buiten deze staffel en is na uitgifte van het ticket niet restitueerbaar.',
    false
);

-- ---------------------------------------------------------------------------
-- 3. Trip: nieuwe velden vullen uit de oude, daarna oude kolommen weg
-- ---------------------------------------------------------------------------

ALTER TABLE "Trip"
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "excludes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "guideId" TEXT,
ADD COLUMN     "heroImageAlt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageAlt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "includes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "maxNights" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "minNights" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "partnerId" TEXT,
ADD COLUMN     "pricePerExtraNight" DECIMAL(10,2),
ADD COLUMN     "pricePpBase" DECIMAL(10,2),
ADD COLUMN     "seasonEndMonth" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "seasonStartMonth" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "stayImageAlt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'individual',
ALTER COLUMN "image" SET DEFAULT '',
ALTER COLUMN "level" SET DEFAULT 'all',
ALTER COLUMN "text" SET DEFAULT '',
ALTER COLUMN "heroImage" SET DEFAULT '',
ALTER COLUMN "heroSubtitle" SET DEFAULT '',
ALTER COLUMN "program" SET DEFAULT '[]',
ALTER COLUMN "stayImage" SET DEFAULT '',
ALTER COLUMN "galleryImages" SET DEFAULT '[]';

UPDATE "Trip" SET
    "partnerId" = 'partner_hipnotics',
    "type" = CASE WHEN "fixedDepartureDate" IS NOT NULL THEN 'group' ELSE 'individual' END,
    "level" = 'all',
    "includes" = array_remove(string_to_array(trim(regexp_replace("included", '<[^>]+>', '', 'g')), ' · '), ''),
    "excludes" = array_remove(string_to_array(trim(regexp_replace("notIncluded", '<[^>]+>', '', 'g')), ' · '), ''),
    "pricePpBase" = NULLIF(replace(replace(regexp_replace("price", '[^0-9,.]', '', 'g'), '.', ''), ',', '.'), '')::numeric,
    "minNights" = GREATEST(1, COALESCE(NULLIF(substring("duration" from '\d+'), '')::int - 1, 7)),
    "maxNights" = GREATEST(1, COALESCE(NULLIF(substring("duration" from '\d+'), '')::int - 1, 7)),
    "imageAlt" = "title",
    "heroImageAlt" = "title",
    "stayImageAlt" = "stayTitle" || ' — ' || "title",
    "galleryImages" = COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('src', elem, 'alt', "Trip"."title"))
         FROM jsonb_array_elements_text("galleryImages") AS elem
         WHERE elem ~ '^(https?://|/uploads/)'),
        '[]'::jsonb
    );

-- Beeldvelden met een oud placeholder-label leegmaken
UPDATE "Trip" SET "image" = '' WHERE "image" !~ '^(https?://|/uploads/)';
UPDATE "Trip" SET "heroImage" = '' WHERE "heroImage" !~ '^(https?://|/uploads/)';
UPDATE "Trip" SET "stayImage" = '' WHERE "stayImage" !~ '^(https?://|/uploads/)';

ALTER TABLE "Trip" ALTER COLUMN "partnerId" SET NOT NULL;

ALTER TABLE "Trip"
DROP COLUMN "category",
DROP COLUMN "date",
DROP COLUMN "duration",
DROP COLUMN "fixedDepartureDate",
DROP COLUMN "included",
DROP COLUMN "notIncluded",
DROP COLUMN "price",
DROP COLUMN "priceNote";

-- ---------------------------------------------------------------------------
-- 4. BookingRequest → Booking: alle v4-aanvragen als "cancelled" bewaren
-- ---------------------------------------------------------------------------

INSERT INTO "Booking" (
    "id", "bookingNumber", "tripId", "arrivalDate", "nights",
    "contactName", "contactEmail", "contactPhone",
    "totalAmount", "status", "notes", "createdAt"
)
SELECT
    b."id",
    COALESCE(b."bookingNumber", 'AT-' || upper(substr(md5(b."id"), 1, 6))),
    b."tripId",
    CASE WHEN b."preferredDate" ~ '^\d{4}-\d{2}-\d{2}$' THEN b."preferredDate"::timestamp ELSE b."createdAt" END,
    t."minNights",
    b."name",
    b."email",
    COALESCE(b."phone", ''),
    COALESCE(NULLIF(replace(replace(regexp_replace(COALESCE(b."totalAmount", ''), '[^0-9,.]', '', 'g'), '.', ''), ',', '.'), '')::numeric, 0),
    'cancelled',
    'v4-aanvraag, gemigreerd ' || to_char(now(), 'YYYY-MM-DD')
        || ' (oude status: ' || b."status" || ', gewenste datum: ' || b."preferredDate" || ')'
        || COALESCE(E'\nBericht: ' || NULLIF(b."message", ''), '')
        || COALESCE(E'\nInterne notitie v4: ' || NULLIF(b."notes", ''), '')
        || COALESCE(E'\nv4 totaalbedrag: ' || NULLIF(b."totalAmount", ''), '')
        || CASE WHEN b."depositPaid" THEN E'\nv4: aanbetaling voldaan' ELSE '' END
        || CASE WHEN b."balancePaid" THEN E'\nv4: restbetaling voldaan' ELSE '' END,
    b."createdAt"
FROM "BookingRequest" b
JOIN "Trip" t ON t."id" = b."tripId";

-- Participant: naam splitsen, FK naar Booking
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_bookingId_fkey";
ALTER TABLE "Participant"
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "level" TEXT;
UPDATE "Participant" SET
    "firstName" = split_part(trim("name"), ' ', 1),
    "lastName" = COALESCE(NULLIF(trim(substr(trim("name"), length(split_part(trim("name"), ' ', 1)) + 1)), ''), '');
ALTER TABLE "Participant" ALTER COLUMN "firstName" DROP DEFAULT;
ALTER TABLE "Participant" DROP COLUMN "name";

-- Invoice: bedrag als Decimal, FK naar Booking
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_bookingId_fkey";
ALTER TABLE "Invoice" ADD COLUMN "amount_new" DECIMAL(10,2);
UPDATE "Invoice" SET "amount_new" = COALESCE(NULLIF(replace(replace(regexp_replace("amount", '[^0-9,.]', '', 'g'), '.', ''), ',', '.'), '')::numeric, 0);
ALTER TABLE "Invoice" DROP COLUMN "amount";
ALTER TABLE "Invoice" RENAME COLUMN "amount_new" TO "amount";
ALTER TABLE "Invoice" ALTER COLUMN "amount" SET NOT NULL;

ALTER TABLE "BookingRequest" DROP CONSTRAINT "BookingRequest_tripId_fkey";
DROP TABLE "BookingRequest";

-- ---------------------------------------------------------------------------
-- 5. Review: oud model (vrije invoer) vervangen door reviews op boekingen.
--    Bestaande rijen waren seed-content zonder boeking en vervallen.
-- ---------------------------------------------------------------------------

DROP TABLE "Review";
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "reviewerPlace" TEXT,
    "travelMonth" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");
CREATE UNIQUE INDEX "Review_token_key" ON "Review"("token");

-- ---------------------------------------------------------------------------
-- 6. SiteSettings: pdf-uploads
-- ---------------------------------------------------------------------------

ALTER TABLE "SiteSettings" ADD COLUMN     "infoFormPdfUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "programPdfUrl" TEXT NOT NULL DEFAULT '';

-- ---------------------------------------------------------------------------
-- 7. Foreign keys
-- ---------------------------------------------------------------------------

ALTER TABLE "Trip" ADD CONSTRAINT "Trip_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TripDeparture" ADD CONSTRAINT "TripDeparture_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TripDeparture" ADD CONSTRAINT "TripDeparture_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TripExtra" ADD CONSTRAINT "TripExtra_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_departureId_fkey" FOREIGN KEY ("departureId") REFERENCES "TripDeparture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;
