# AdventureTravels.nl

Next.js 16 (App Router) · Prisma 6 op Neon Postgres · Vercel Blob · Resend · MailerLite.
Eigen CMS onder `/admin`, klantportaal op `mijn.adventuretravels.nl` (intern `/portal`), staff-portaal onder `/portal/staff`.

Lees `AGENTS.md` en de Next.js-docs in `node_modules/next/dist/docs/` voordat je code schrijft.

## Sleutels en omgevingsvariabelen

Sleutels staan **niet** in git. `.env*` is uitgesloten via `.gitignore`; alleen `.env.example` (namen, geen waarden) wordt gecommit.

Lokaal werken:

```bash
npm install
npx vercel link
npx vercel env pull .env
npm run dev
```

Nieuwe of gewijzigde sleutels beheer je in Vercel (Project → Settings → Environment Variables) en haal je daarna opnieuw op met `vercel env pull`. Een sleutel die ooit in git of in een chat heeft gestaan, roteer je in Vercel.

Zie `.env.example` voor de volledige lijst variabelen.

## Database en migraties

De database is de enige bron van waarheid voor content, prijzen en voorwaarden. Een deploy verandert nooit content.

- Schema: `prisma/schema.prisma`. Wijzigingen gaan altijd via een migratie: `npm run db:migrate` (lokaal, maakt een map aan onder `prisma/migrations/`).
- Deploy: `vercel-build` draait `prisma migrate deploy && next build`. Er draait **geen** `db push` en **geen** seed meer tijdens een build.
- Seed: `npm run db:seed` is alleen bedoeld voor een lege database. Hij maakt uitsluitend aan wat nog niet bestaat en overschrijft nooit bestaande rijen. Zet `SEED_ADMIN_PASSWORD` om een eerste admin aan te maken.

### Eenmalig: bestaande database baselinen

De productiedatabase is tot en met v4 met `prisma db push` opgebouwd, zonder migratiegeschiedenis. Vóór de eerste deploy met `migrate deploy` moet de beginmigratie `0_init` één keer als "al toegepast" worden gemarkeerd, anders probeert Prisma bestaande tabellen opnieuw aan te maken en faalt de build:

```bash
npx vercel env pull .env
npx prisma migrate resolve --applied 0_init
```

Dit schrijft alleen een rij in `_prisma_migrations`; het raakt geen data. Daarna werken alle volgende migraties automatisch bij deploy.

### Eenmalig: v4-content opschonen

De v4-seed heeft fictieve reviews, aantallen en teksten over aanbetaling en kosteloos annuleren in de database gezet. Die verdwijnen niet door een deploy. Draai eenmalig, eerst als dry-run:

```bash
DRY_RUN=1 npm run db:cleanup-v5
npm run db:cleanup-v5
```

Het script raakt alleen rijen die aantoonbaar uit de oude seed komen of een oude claim bevatten; handmatig ingevoerde content blijft staan.

### Generale repetitie op een Neon-branch

Maak in Neon een branch van productie en zet die `DATABASE_URL` in `.env`. Dan:

```bash
npm run db:verify -- before
npx prisma migrate resolve --applied 0_init
npx prisma migrate deploy
npm run db:cleanup-v5
npm run db:verify -- after
```

`db:verify` telt reizen, boekingen per status, deelnemers, facturen, reviews en partners (raw SQL, werkt op v4 én v5) en toont bij `after` het verschil met `before`, inclusief boekingen die niet zijn teruggevonden. Snapshots staan in `.db-verify/` (niet in git).

### Volgorde bij de v5-upgrade van een bestaande database

1. `npx prisma migrate resolve --applied 0_init` (eenmalig, vóór de eerste deploy).
2. Deploy. `migrate deploy` past `20260902100000_fase1_site_settings` en `20260902120000_fase2_datamodel` toe. De Fase 2-migratie zet alle oude `BookingRequest`-rijen om naar `Booking` met status `cancelled` en een notitie "v4-aanvraag, gemigreerd …", maakt de partner Hipnotics aan (inactief, lege staffel) en koppelt bestaande reizen daaraan. De oude `Review`-tabel (vrije invoer) wordt vervangen; reviews ontstaan voortaan alleen uit boekingen.
3. `npm run db:cleanup-v5` (na de deploy, met de nieuwe Prisma-client).
4. In `/admin`: staffel van Hipnotics invullen en de partner op actief zetten, prijs en foto's van de Antalya-reis invullen, status op "Gepubliceerd". De reis verschijnt pas op de site als `publishProblems()` leeg is; het reisformulier toont wat er nog mist.

## Datamodel (v5)

- `Partner` (park/gym/accommodatie) draagt de annuleringsstaffel; `src/lib/cancellation.ts` valideert en rendert die overal (reispagina, checkout, mail, portaal).
- `Trip` is `individual` (eigen aankomstdatum, nachten, prijs p.p. bij `minNights` + extra nacht) of `group` (vaste `TripDeparture`s, all-in incl. vlucht). `TripExtra` = bijboekbare extra's.
- `Booking` vervangt `BookingRequest`: 100% betaling via Mollie (`Payment`), prijsopbouw en staffel als snapshot, voorwaarden-acceptatie met tijdstip. `Invoice` blijft voor handmatige vluchtfacturen.
- `Review` hangt altijd aan een `Booking` (token-flow), `Lead` vangt pdf-aanvragen, gids-terugbelverzoeken en groepsaanvragen.
- Publicatiecheck: `isTripPublishable()` in `src/lib/publish.ts`; alle publieke queries in `src/lib/content/trips.ts` filteren erop.
- Bedragen zijn `Decimal`; formattering via `formatPrice()` in `src/lib/format.ts`.
- Een `Booking` kan alleen `pending_payment`, `paid` of `confirmed` zijn als `termsAcceptedAt` én `cancellationTermsAcceptedAt` gevuld zijn: afgedwongen in `src/lib/content/bookings.ts` en als CHECK-constraint `Booking_terms_required_for_active_status` (Prisma kent CHECK-constraints niet; `prisma migrate dev` kan die als drift melden, negeren).
- Feature flag `CHECKOUT_ENABLED` (env): zolang die niet `true` is, komt geen enkele reis door de publicatiecheck.

## Checkout en betaling (v5)

- `/boeken/[slug]` in drie stappen (reis → gegevens → overzicht en betaling). De concept-boeking staat in een gesigneerde cookie (`src/lib/checkoutSession.ts`); persoonsgegevens komen nooit in de URL.
- Eén prijsberekening voor reispagina, checkout, server action, mail en bevestiging: `calculateBreakdown()` in `src/lib/pricing.ts` (hele centen).
- Betalen via Mollie (`src/lib/mollie.ts`). Webhook `/api/mollie/webhook` haalt de betaling altijd zelf op en verwerkt overgangen precies één keer (`updateMany` met statusvoorwaarde). De bevestigingspagina synchroniseert ook zelf, voor als de webhook nog onderweg is.
- Bankoverschrijving: boeking blijft `pending_payment`, klant krijgt Mollie-instructies per mail; `/api/cron/checkout-followup` (dagelijks 08:00, `vercel.json`, beveiligd met `CRON_SECRET`) stuurt na 3 dagen een herinnering en annuleert na 7 dagen.
- Mails via Resend in `src/lib/email.ts`; het standaardinformatieformulier (`SiteSettings.infoFormPdfUrl`) gaat als bijlage mee. Zonder dat formulier komt geen enkele reis door de publicatiecheck.
- Programma-pdf (`ProgramCta`): naam + e-mail + optioneel nieuwsbriefvinkje → `Lead(type=pdf_request)` → mail met de pdf uit `SiteSettings.programPdfUrl`. Geen pdf = blok niet zichtbaar.
- Lokaal testen: Mollie-testsleutel in `.env`; webhooks bereiken localhost niet, de bevestigingspagina vangt dat op.

## Beelden

Alle beeldvelden bevatten een Blob-URL of zijn leeg. Een leeg veld betekent: het element wordt niet getoond. Er bestaan geen placeholders meer; een reis zonder echte foto's is niet publiceerbaar.

## Scripts

| Script | Doel |
| --- | --- |
| `npm run dev` | Dev-server op http://localhost:3000 |
| `npm run build` | Productiebuild (zonder migraties) |
| `npm run db:migrate` | Nieuwe migratie maken en lokaal toepassen |
| `npm run db:deploy` | Openstaande migraties toepassen (wat Vercel doet) |
| `npm run db:seed` | Lege database vullen met startcontent |
| `npm run db:cleanup-v5` | Eenmalige opschoning van v4-content (zie boven) |
| `npm run lint` | ESLint |
