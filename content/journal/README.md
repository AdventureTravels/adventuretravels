# Journal-artikelen (SEO + GEO)

Bronbestanden voor het journal. Importeren met `npm run journal:import -- --write`
(dry-run zonder `--write`; `--update` overschrijft bestaande artikelen op slug).

## Regels voor elk artikel

- **Antwoord eerst.** De eerste alinea beantwoordt de zoekvraag in twee tot drie zinnen, zonder aanloop. AI-zoekmachines citeren die alinea.
- **Kort antwoord** als callout (`> **Kort antwoord:** …`): één of twee zinnen die los te citeren zijn.
- **Feiten met bron of markering.** Alles wat niet uit eigen ervaring of de database komt, krijgt `[CHECK: …]`. Het importscript weigert bestanden met zo'n markering; verwijder ze pas na controle. Nooit een getal verzinnen.
- **Één zoekwoord per artikel** in titel, eerste alinea en minstens één H2; ondersteunende zoekwoorden in de FAQ-vragen.
- **FAQ-sectie** met drie of vier vragen (`### Vraag` + antwoord van maximaal 60 woorden). Die worden als `FAQPage`-structured data uitgestuurd.
- **Interne links** naar de reispagina, spreek-een-gids en minstens één ander artikel. Geen externe links naar concurrenten.
- **Je-vorm, Nederlands, geen superlatieven** zonder onderbouwing. Geen claims over aantallen reizigers, reviews of keurmerken.

## Wat de site automatisch doet

- `Article` en `FAQPage` JSON-LD, canonical en Open Graph per artikel (`src/app/journal/[slug]/page.tsx`).
- Hero-foto alleen als er een echte upload is; zonder foto geen placeholder.
- Gerelateerde reizen onder het artikel uit de database.
