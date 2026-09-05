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
- Deploy: `vercel-build` draait `prisma migrate deploy && next build` Migraties lopen over `DATABASE_URL_UNPOOLED` (directe Neon-verbinding; valt terug op `DATABASE_URL`), omdat Prisma's advisory lock via de pooler blijft hangen op een hergebruikte verbinding. Eén herkansing na 20 s voor als twee deploys elkaar raken. Er draait **geen** `db push` en **geen** seed meer tijdens een build.
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

## Formulieren (v5)

- Alle publieke formulieren (contact, spreek-een-gids, groepen & bedrijven, programma-pdf, portaal-inloglink, checkout stap 3) hebben Cloudflare Turnstile (`src/lib/turnstile.ts`, `src/components/Turnstile.tsx`) en een privacyzin met link (`FormPrivacy`). Veldnamen zijn overal `name`, `email`, `phone`.
- Sleutels: `TURNSTILE_SITE_KEY` en `TURNSTILE_SECRET`. Zonder sleutels gebruikt development de officiële Cloudflare-testsleutels (altijd geslaagd); productie laat het formulier door met een foutmelding in de log. Voeg in het Cloudflare-dashboard `adventuretravels.nl`, `mijn.adventuretravels.nl` en `localhost` toe als hostnames.
- Aanvragen komen als `Lead` in de database (`pdf_request`, `guide_callback`, `group_inquiry`, `contact`) en als mail bij `SiteSettings.email`, met de reisnaam in het onderwerp waar bekend.

## Reviews (v5)

- `/api/cron/review-requests` (dagelijks 09:00) mailt 3 dagen na thuiskomst (retourdatum, of aankomst + nachten) één keer per betaalde of bevestigde boeking een link `/review/[token]`. Het token is een gesigneerd boekings-id (`src/lib/reviewToken.ts`); `Booking.reviewRequestedAt` voorkomt dubbele mails.
- De reviewpagina vraagt score, tekst, voornaam en woonplaats en toestemming; de review komt binnen als `pending`. Alleen `approved` reviews staan op de site (homepage sitebreed, reispagina per reis; gemiddelde pas vanaf 10). Goedkeuren in `/admin/reviews`; vrije invoer bestaat niet meer.

## Admin (v5)

- `/admin/trips`: reisformulier met publicatieproblemen bovenaan; onder het formulier vertrekken (groepsreizen) en extra's per reis.
- `/admin/partners` (staffel-editor met validatie), `/admin/guides`, `/admin/sports` (met icoon), `/admin/bookings` (zelfde schermen als het staff-portaal op mijn.adventuretravels.nl/staff), `/admin/leads` (afhandelen), `/admin/reviews` (goedkeuren), `/admin/settings` (USP's, foto's, programma-pdf, standaardinformatieformulier).
- Nieuwe sport, partner en reis zijn zonder code toe te voegen; een reis staat pas op de site als het formulier geen problemen meer meldt.

## Tracking en consent (v5)

- Cookiebanner (`src/components/Consent.tsx`) met Accepteren en Weigeren gelijkwaardig op de eerste laag. Keuze in cookie `at_consent` (180 dagen); de footer-link "Cookie-instellingen" opent de banner opnieuw.
- Vóór een keuze laadt niets. Na een keuze: Consent Mode v2 `default` (alles denied) + `update` met de keuze, event `consent_update` met `consent_analytics` en `consent_marketing`, daarna pas het GTM-script. Microsoft Clarity laadt alleen bij "granted". Tag-id's: `NEXT_PUBLIC_GTM_ID` en `NEXT_PUBLIC_CLARITY_ID` (leeg = niet laden).
- Events op de dataLayer (`src/lib/analytics.ts`): `view_trip`, `begin_checkout`, `add_payment_info`, `purchase` (transaction_id = boekingsnummer, value = totaal, één keer per boeking), `generate_lead` (lead_type: guide_callback, group_inquiry, contact, pdf_request).

### In GTM instellen

1. Zet in de container **Consent Overview** aan en geef elke tag een ingebouwde consent-eis: GA4-tags `analytics_storage`, advertentietags (Google Ads, Meta) `ad_storage` + `ad_user_data` + `ad_personalization`. Tags met een consent-eis vuren dan alleen als de status "granted" is, ook bij een pageview.
2. Maak een trigger **Custom Event** `consent_update` met voorwaarde `consent_analytics equals granted` (voor GA4-configuratie) en één met `consent_marketing equals granted` (voor advertentietags). Gebruik die als trigger voor de configuratietags, zodat ze na een latere "Accepteren" alsnog starten zonder herlaad.
3. Maak Custom Event-triggers voor `view_trip`, `begin_checkout`, `add_payment_info`, `purchase` en `generate_lead`, met dataLayer-variabelen `trip_slug`, `value`, `currency`, `transaction_id`, `lead_type`.
4. Controle in een schone browser: vóór een klik op de banner mogen geen `_ga`, `_fbp`, `_gcl_au` of `_clck`-cookies bestaan; na "Weigeren" ook niet.

## Journal (SEO + GEO)

Artikelen staan als markdown in `content/journal/` en gaan met `npm run journal:import -- --write` de database in; conventies en de `[CHECK]`-regel staan in `content/journal/README.md`. Elke artikelpagina stuurt `Article`- en `FAQPage`-structured data, canonical en Open Graph uit; FAQ-blokken zijn in de admin per sectie te bewerken.

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
