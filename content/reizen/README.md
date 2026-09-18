# Reizen als markdown

Eén bestand per reis, geïmporteerd met `npm run trips:import` (zie `scripts/import-trips.ts`).
De database blijft de bron van waarheid: het script zet de reis erin, daarna beheer je hem in `/admin/trips`.

- Bestanden die met `_` beginnen zijn intern en worden niet geïmporteerd.
- Een bestand met een `[[ ]]`-markering wordt geweigerd: eerst bevestigen, dan importeren.
- Sport, bestemming, partner en gids moeten al in de admin bestaan; het script verzint ze niet.
- De status is standaard `draft`. Publiceren doe je in de admin, als prijs, foto's en de
  annuleringsstaffel van de partner er zijn (de publicatiecheck in `src/lib/publish.ts` bepaalt het).

## Secties

| Kop | Komt terecht in |
|---|---|
| `## Kaart` | korte tekst op de reiskaart (`text`) |
| `## Hero` | subtitel in de hero (`heroSubtitle`) |
| `## Intro` | intro boven het programma (`introBody`) |
| `## Sectie: <titel>` | vrije sectie; eerste regel `placement: top` zet hem vóór het programma |
| `## Programma` | `- Dag 1 · Aankomst — tekst` per regel |
| `## Verblijf` | verblijf-sectie (`stayBody`, titel via `stayTitle` in de frontmatter) |
| `## Inbegrepen` / `## Niet inbegrepen` | lijsten met `- ` |
| `## FAQ` | `### vraag` + antwoord; komt ook als FAQ-structured data op de pagina |
| `## CTA: <titel>` | blok onderaan de pagina |
| `## Galerij` | `- /images/... \| alt-tekst` per foto (`galleryImages`) |
| `## Extra's` | `- Naam \| prijs \| eenmalig of per nacht \| omschrijving`; vervangt bij `--update` alle extra's |

Frontmatter: `slug`, `title`, `sport`, `destination`, `partner`, `guide`, `type`, `status`, `level`,
`seasonStartMonth`, `seasonEndMonth`, `minNights`, `maxNights`, `minPersons`, `pricePpBase`, `pricePerExtraNight`,
`priceNote`, `stayTitle`, `metaTitle`, `metaDescription`, `order`.

Beeld kan op twee manieren: uploaden in de admin (Vercel Blob), of meeleveren in de repo onder
`public/images/reizen/<bestemming>/` en in de frontmatter zetten (`image`, `heroImage`, `heroVideo`, `stayImage`
+ de `*Alt`-velden) en onder `## Galerij`. Alleen velden die in het bestand staan worden overschreven.
Hou de hero-video onder de 10MB (H.264, geen geluid).
