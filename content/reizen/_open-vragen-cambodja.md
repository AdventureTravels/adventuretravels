# Intern · Wakeboardweek Siem Reap (niet publiceren)

Wordt niet geïmporteerd (bestandsnaam begint met `_`).
Bron: wakeparkcambodia.com, alle pagina's uit hun sitemap gelezen op 12 september 2026.

## Update 18 september 2026 (afspraken bevestigd, zie Notion "Wake Park Cambodia (Leo Reuter)")

De reispagina is herschreven op de bevestigde afspraken: volpension (ontbijt, lunch, diner, 1 barista-koffie
per dag), 7-daagse baanpas, transfer luchthaven SAI heen en terug, drie kamertypes, minimaal 7 nachten.
Websitecheck 18 sep: check-in 14:00, check-out 10:00 (Cloudbeds). Base Rooms staan alleen in Cloudbeds:
tuinzicht, airco, terras, eigen badkamer, werkhoek, max. 2 volwassenen + 1 kind. "1 hour from Bangkok"
staat er nog steeds.

**Keuzes gemaakt in het bestand, door Wouter te bevestigen:**
- Prijs: Base Room USD 465 p.p. (brochure, 2 pers.) → **€ 419** (koers 1,148 op 18 sep + ca. 3% koersbuffer;
  nooit onder Leo's prijs, afspraak prijspariteit).
- Toeslag Lakeside Bungalow USD 55 p.p. → **€ 49**; Pool Bungalow USD 155 p.p. → **€ 139** (extra's, eenmalig p.p.).
- Seizoen **april t/m december**: kerst t/m maart koopt AdventureTravels in tegen brochureprijs, dus daar zit
  geen marge in; jan/feb zijn bovendien vol. Kerstweek valt formeel in december: vertrek na 19 dec niet aannemen
  zolang Leo daar geen kamers voor vasthoudt.
- Minimaal 2 personen (prijs is op basis van 2 per kamer). Solo op aanvraag (Leo: 1 persoon Base USD 585).

**Nog te doen in de admin (lokale .env heeft geen DATABASE_URL, dus niet door Claude gedaan):**
1. Migratie `20260918120000_trip_hero_video` draaien (`npx prisma migrate deploy`).
2. Annuleringsstaffel partner Wake Park Cambodia: kosteloos tot 30 dagen, 50% van 30 tot 14 dagen,
   100% binnen 14 dagen voor aankomst.
3. `npm run trips:import -- --write --update` (zet tekst, prijs, foto's, video en de twee extra's).

**Nog open bij Leo:**
- Horen instructeur en huurboard ook bij de weekpas? Staat daarom niet in "Inbegrepen".
- Minimumleeftijd, zwemvaardigheid en waiver voor de kabel.
- Stapelt de promocode op de langverblijfkorting (bepaalt of de marge ca. 13% of 3–5% is).
- Echte foto's van de bungalows (Leo: booking engine toont nog renders).

## Bevestigd op hun eigen site (12 september)

**Het park.** Geopend in 2020 als ICF Wake Park, sinds juni 2023 Wake Park Cambodia onder twee Zwitserse
families (Reuter en Wunderli). Nadia en Leo Reuter runnen het park, met 45 lokale medewerkers.
WakeparX-systeem, enige full-size kabel van Cambodja, tien units, eiland in het midden van het meer dat
zones met vlak water maakt. Elke dag open van 9:00 tot 21:00.

**Kabeltarieven.** 2 uur $24 · dagkaart $32 · week $180 · maand $420 · 3 maanden $650 · jaar $890 ·
10x-pas (2 uur) $200. Bij een kaartje: instructeur, basisboard, waterski, kneeboard, zwemvest, helm.

**Verblijf.** Acht bungalows aan het meer, 2 tot 4 personen, minimaal 2.
Lakeside Bungalow 36 m², queensize of twin, buitenlounge, snel internet, $32 p.p.p.n.
Lakeside Pool Bungalow 54 m², eigen zwembad en terras, binnenlounge met airco, snel internet, $50 p.p.p.n.
Gasten krijgen 15% korting op alle tickets. Hun eigen boekingen lopen via Cloudbeds.

**Overige onderdelen.** Aqua Land $12 dagkaart, inclusief zwemvest. Paintball starterpack $15 p.p.
(120 ballen), extra ballen $7–$170, vanaf 10 jaar, onder 14 met toestemming van een ouder, minimaal 6
spelers, arena van 4.500 m², schoenhuur $2. Strand met natuurlijk zwemmeer, vijf bamboehutten, jungle gym
en ijsstand; minimale besteding $5 per volwassene; privéhutten in drie maten, de premium met plunge pool,
bbq, koelkast, eigen douche en toilet. Restaurant 9:00–21:00, Khmer en westers, cocktails en smoothies.
Events voor 20 tot 300 gasten.

**Contact.** 1 ICF Campus Road, Siem Reap · +855 (0) 95 882 421 (ook WhatsApp) · info@wakeparkcambodia.com ·
Facebook, Instagram, TikTok en YouTube onder @wakeparkcambodia.

## Hun voorwaarden, en wat dat voor ons betekent

- **Auteursrecht (policy/copyright-notice).** Hun tekst, foto's en video mag je niet publiceren, verspreiden
  of tonen zonder schriftelijke toestemming. Onze pagina is daarom in eigen woorden geschreven; vraag Leo
  schriftelijk toestemming plus bestanden vóór we beeld van hen gebruiken. Geldt ook voor de hero-video die
  nu in de admin kan: die toont een bord van dit park en mag pas live met toestemming.
- **Websitevoorwaarden (policy/website-terms).** Recht van Cambodja, alle garanties uitgesloten. Er staat
  niets over boeken, betalen, annuleren of terugbetalen: die afspraken moeten dus uit een contract met Leo
  komen, niet van hun site. Er is ook een privacy- en een cookiebeleid, allebei alleen over hun website.
- **Niet op hun site te vinden:** check-in- en check-outtijden, annulerings- en betaalvoorwaarden van het
  verblijf, borg, huisregels, kinder- en huisdierbeleid, ontbijt, minimumleeftijd of zwemvaardigheid voor de
  kabel, en of instructeur en materiaal ook bij de weekpas horen.

## Openstaand bij Leo (moet rond zijn vóór publicatie)

1. Netto-tarieven per seizoen voor beide bungalowtypes en voor de weekpas.
2. Geldt de 15% gastenkorting ook op de weekpas, of zit die al in het netto-tarief?
3. Horen instructeur en huurmateriaal ook bij de weekpas, of alleen bij losse kaartjes?
   Zolang dat niet bevestigd is, moeten die twee regels uit "Inbegrepen".
4. Check-in- en check-outtijden, en hun annulerings- en betaalvoorwaarden voor het verblijf.
   **Dit bepaalt onze eigen staffel** op de partner in /admin/partners: zonder geldige staffel gaat de reis
   niet live, en de staffel wordt bij elke boeking vastgelegd en getoond in stap 3 van de checkout.
5. Is ontbijt mogelijk als vast onderdeel, en tegen welk tarief?
6. Regelen zij de luchthaventransfer en de Angkor-dag (gids, tuktuk, toegangspas), of kopen we die los in?
   Het programma noemt beide; ze staan nog niet in "Inbegrepen" omdat ze niet zijn ingekocht.
7. Hoe druk is de kabel in het weekend en rond Khmer-feestdagen?
8. Hoeveel bungalows kunnen we per week vasthouden?
9. Toestemming en bestanden voor foto's en video (zie auteursrecht hierboven).
10. Minimumleeftijd en zwemvaardigheid voor de kabel, en of er een waiver getekend moet worden.
11. Hun accommodatiepagina zegt "just 1 hour from Bangkok". Dat klopt niet; Leo kan dat laten corrigeren.

## Bewust niet op de pagina, want nergens bevestigd

- Afstand en reistijd park–centrum Siem Reap en park–luchthaven. Een reisblog noemt twaalf minuten naar de
  stad, maar het park zegt er zelf niets over.
- Concrete temperaturen per maand.
- Rijden onder verlichting. Het park is tot 21:00 open, maar over lichtmasten staat nergens iets.
- Drukte en wachttijd op de kabel in het weekend.

## Eerst zelf beslissen

- **Prijs.** `pricePpBase` is leeg; zonder prijs blijft de reis onzichtbaar. Kostenbasis op publieke tarieven,
  vóór korting: Lakeside $224 + weekpas $180 = $404 p.p.; Pool $350 + $180 = $530 p.p. Nog niet ingeprijsd:
  transfers, Angkor-dag, maaltijden, ontbijt, marge, VZR-bijdrage, dollarkoers.
- **Poolbungalow.** Nog geen keuze in de checkout; zodra het prijsverschil bekend is, toevoegen als extra in
  /admin/trips → Extra's (per nacht of eenmalig p.p.).
- **Bestemming en partner.** "Cambodja" (bestemming) en "Wake Park Cambodia" (partner, mét annuleringsstaffel
  en contactgegevens) moeten in de admin bestaan voordat de import kan draaien.
- **Standaardinformatieformulier pakketreis.** Staat in Site-instellingen en is verplicht: zonder pdf blijft
  elke reis onzichtbaar. Klanten vinken in stap 3 af dat ze het hebben ontvangen, en het gaat als bijlage mee
  met de bevestigingsmail.
- **Ervaringsclaim.** "Zelf getest, of we boeken het niet" pas gebruiken als je er zelf bent geweest.
