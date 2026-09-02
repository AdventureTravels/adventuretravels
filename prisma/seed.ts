/**
 * Seed voor een LEGE database.
 *
 * Regels:
 * - Maakt alleen aan wat nog niet bestaat (findUnique/findFirst → create).
 *   Nooit upsert-met-update, nooit deleteMany: wijzigingen die via /admin zijn
 *   gedaan mogen niet door een seed worden overschreven.
 * - Draait nooit automatisch (niet in `vercel-build`). Handmatig: `npm run db:seed`.
 * - Bevat geen fictieve reviews, aantallen, keurmerken of voorwaarden.
 *   Ontbreekt iets, dan wordt het element op de site simpelweg niet gerenderd.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function p(text: string) {
  return `<p>${text}</p>`;
}

function ps(texts: string[]) {
  return texts.map(p).join("");
}

function log(action: "created" | "skipped", what: string) {
  console.log(`${action === "created" ? "+" : "="} ${what}`);
}

async function main() {
  // --- Admin user ---
  // Wachtwoord komt uit SEED_ADMIN_PASSWORD; zonder die variabele wordt geen admin aangemaakt.
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "wouter@bureauberk.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!(await prisma.adminUser.findUnique({ where: { email: adminEmail } }))) {
    if (!adminPassword) {
      console.warn(`! Geen admin aangemaakt: zet SEED_ADMIN_PASSWORD om ${adminEmail} aan te maken.`);
    } else {
      await prisma.adminUser.create({
        data: { email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 10) },
      });
      log("created", `admin ${adminEmail}`);
    }
  } else {
    log("skipped", `admin ${adminEmail}`);
  }

  // --- Sport ---
  let wakeboarden = await prisma.sport.findUnique({ where: { slug: "wakeboarden" } });
  if (!wakeboarden) {
    wakeboarden = await prisma.sport.create({
      data: {
        slug: "wakeboarden",
        name: "Wakeboarden",
        heroImage: "",
        heroTitle: "Wakeboarden zoals het bedoeld is: veel water, weinig wachttijd.",
        heroSubtitle: p(
          "Cable parks met korte wachtrijen en boat-sessies met een instructeur die precies ziet waar je op vastloopt."
        ),
        cardImage: "",
        caption: "Cable parks en boat-sessies",
        order: 0,
      },
    });
    log("created", "sport wakeboarden");
  } else {
    log("skipped", "sport wakeboarden");
  }

  // --- Destination ---
  let turkije = await prisma.destination.findUnique({ where: { slug: "turkije" } });
  if (!turkije) {
    turkije = await prisma.destination.create({
      data: {
        slug: "turkije",
        name: "Turkije",
        heroImage: "",
        heroTitle: "De cable parks aan de Turkse Riviera.",
        heroSubtitle: p(
          "Antalya en omgeving, met een partner-park dat we uit eigen ervaring kennen: meerdere weken achter elkaar getest, niet één keer bezocht."
        ),
        cardImage: "",
        caption: "Antalya en omgeving · april tot oktober",
        flightTime: "4 uur",
        bestPeriod: "April — oktober",
        order: 0,
      },
    });
    log("created", "destination turkije");
  } else {
    log("skipped", "destination turkije");
  }

  // --- Trip ---
  // Afbeeldingen blijven leeg: een reis zonder echte foto's is niet publiceerbaar
  // en wordt pas getoond nadat ze in /admin zijn geüpload.
  if (!(await prisma.trip.findUnique({ where: { slug: "wakeboardweek-antalya" } }))) {
    await prisma.trip.create({
      data: {
        slug: "wakeboardweek-antalya",
        title: "Wakeboardweek Antalya",
        image: "",
        level: "Beginner tot gevorderd",
        category: "Turkije · wakeboarden",
        text: p("Vijf dagen op de kabel, verblijf bij het park inbegrepen."),
        duration: "7 dagen",
        date: "April — oktober",
        price: "",
        priceNote: "",
        heroImage: "",
        heroSubtitle: p("Vijf dagen op de kabel, twee weken zonder jetlag terugkomen."),
        program: [
          { day: "DAG 1", text: "Aankomst & intake niveau" },
          { day: "DAG 2–6", text: "Dagelijkse sessies op de kabel, avonden vrij" },
          { day: "DAG 7", text: "Vertrek" },
        ],
        included: p("Verblijf · ontbijt & diner · cable park-pas · transfer"),
        notIncluded: p("Vlucht · reisverzekering · persoonlijke uitgaven"),
        stayTitle: "Het verblijf",
        stayBody: ps([
          "Accommodatie direct aan het park, zelf getest door het team voordat de reis werd toegevoegd.",
          "Eigen kamer, ontbijt inbegrepen, en avonden met een gezamenlijk diner in het dorp.",
        ]),
        stayImage: "",
        galleryImages: [],
        fixedDepartureDate: null,
        order: 0,
        sportId: wakeboarden.id,
        destinationId: turkije.id,
      },
    });
    log("created", "trip wakeboardweek-antalya");
  } else {
    log("skipped", "trip wakeboardweek-antalya");
  }

  // --- Articles ---
  const articles = [
    {
      slug: "antalya-warm-water",
      tag: "Turkije · 5 min",
      title: "Waarom Antalya jaarrond warm water heeft",
      excerpt: "Wat het seizoen bepaalt voor je sessies op de kabel.",
      heroImage: "",
      intro: p(
        "Wat het seizoen bepaalt voor je sessies op de kabel. De Turkse Riviera houdt langer warm water dan de rest van de Middellandse Zee, en dat verschuift het hele wakeboardseizoen met bijna twee maanden."
      ),
      sections: [
        {
          title: "Het water blijft langer op temperatuur",
          bodyHtml: ps([
            "De baai bij Antalya is ondiep en wordt van drie kanten door bergen afgeschermd. Dat zorgt voor twee dingen: het water warmt in het voorjaar snel op en het koelt in het najaar traag af. In april zit je al rond de negentien graden, en in oktober is het nog steeds warmer dan de Noordzee in augustus.",
          ]),
        },
        {
          title: "Wind is hier belangrijker dan temperatuur",
          bodyHtml: ps([
            "Voor cable parks is vlak water belangrijker dan een graad meer of minder. De ochtenden zijn vrijwel windstil; vanaf een uur of twee trekt de zeewind aan. Daarom leggen we sessies in het programma vroeg, en houden we de middag vrij.",
          ]),
          quoteHtml: p(
            "Wie voor het eerst achter de kabel staat, boekt het best in mei of september: warm water, rustige parken en geen hitte in de middag."
          ),
        },
        {
          title: "Wat dat betekent voor je boeking",
          bodyHtml: ps([
            "Het seizoen loopt van april tot oktober. Juli en augustus zijn warm en druk; de randmaanden geven meer tijd op het water per dag. In onze reizen staan de sessies daarom altijd in de ochtend, met de avond vrij voor het dorp.",
          ]),
        },
      ],
      publishedAt: "12 augustus 2026",
      order: 0,
    },
    {
      slug: "welke-board-past-bij-jouw-niveau",
      tag: "Materiaal · 4 min",
      title: "Welke board past bij jouw niveau",
      excerpt: "Praktisch overzicht voor beginners en gevorderden.",
      heroImage: "",
      intro: p(
        "Een board is geen prestatiekeuze maar een leercurve-keuze. Wie op de kabel begint heeft een ander volume, een andere rocker en een andere vinsetup nodig dan wie al aan de eerste kickers toe is. Drie types, en wanneer je van het ene naar het andere gaat."
      ),
      sections: [
        {
          number: "01",
          title: "Beginnersboard",
          bodyHtml: ps([
            "Groot volume, een vlakke tot licht doorlopende rocker en vaste vinnen van rond de dertig millimeter. Dat maakt het board voorspelbaar: het komt snel op het water, houdt koers en straft een verkeerde gewichtsverdeling niet direct af.",
            "Het gaat hier om zo veel mogelijk succesvolle starts per sessie. Een board dat wat groter is dan je later zou kiezen, verkort de eerste dag aanzienlijk. Op de meeste cable parks is dit ook het materiaal dat standaard bij de pas hoort.",
          ]),
        },
        {
          number: "02",
          title: "Freeride",
          bodyHtml: ps([
            "Middelgroot volume, een continue rocker en kleinere vinnen, vaak met een deel van de kant als vervanging voor grip. Het board blijft rustig in het water maar laat toe dat je het los stuurt, wat nodig is zodra je de wake gaat oversteken.",
            "Dit is het type waarmee de meeste riders het langst doen. Ga hierop over zodra je zonder nadenken twee kanten van de kabel afmaakt en aan je eerste overgangen begint.",
          ]),
        },
        {
          number: "03",
          title: "Park en kabel",
          bodyHtml: ps([
            "Kleiner volume, een sterkere three-stage rocker en meestal finless, met een versterkte basis voor sliders en rails. Het board pops harder van de kicker en glijdt over obstakels zonder te haken, maar vergeeft minder op vlak water.",
            "Zinvol zodra je gericht op features gaat rijden. Rij je nog vooral rondjes met een enkele sprong, dan levert dit type meer valpartijen op dan progressie.",
          ]),
        },
      ],
      calloutLabel: "Kort antwoord",
      calloutText: p(
        "Huur de eerste twee reizen. Materiaal is bij onze reizen inbegrepen, en de begeleiding wisselt tijdens de week van board zodra je niveau daar aanleiding voor geeft. Pas daarna weet je wat je zelf wilt kopen."
      ),
      publishedAt: "31 augustus 2026",
      order: 1,
    },
  ];
  for (const article of articles) {
    if (await prisma.article.findUnique({ where: { slug: article.slug } })) {
      log("skipped", `article ${article.slug}`);
      continue;
    }
    await prisma.article.create({ data: article });
    log("created", `article ${article.slug}`);
  }

  // --- Reviews ---
  // Geen seed: reviews ontstaan alleen uit echte boekingen (Fase 6).

  // --- FAQ ---
  const faqs = [
    {
      question: "Welk niveau heb ik nodig?",
      answer: p("Geen ervaring nodig. Elke reis vermeldt het geschikte niveau; twijfel je, bel dan even met een gids."),
    },
    {
      question: "Hoe betaal ik?",
      answer: p("Je betaalt de volledige reissom bij boeking via iDEAL, creditcard of bankoverschrijving."),
    },
    {
      question: "Kan ik annuleren?",
      answer: p(
        "Ja. De annuleringsvoorwaarden verschillen per park en staan op de reispagina, in de checkout en in je bevestigingsmail."
      ),
    },
    {
      question: "Is de vlucht inbegrepen?",
      answer: p(
        "Bij individuele reizen niet. Wij boeken je vlucht op aanvraag bij; je ontvangt dan binnen 24 uur een prijs. Bij groepsreizen is de vlucht wel inbegrepen."
      ),
    },
  ];
  for (let i = 0; i < faqs.length; i++) {
    const f = faqs[i];
    if (await prisma.faqItem.findFirst({ where: { question: f.question } })) {
      log("skipped", `faq "${f.question}"`);
      continue;
    }
    await prisma.faqItem.create({ data: { ...f, order: i } });
    log("created", `faq "${f.question}"`);
  }

  // --- Pages ---
  const pages = [
    {
      slug: "over-ons",
      eyebrow: "Het verhaal",
      title: "Vijftien jaar op de kabel, nu ook achter de schermen.",
      subtitle: p(
        "AdventureTravels is ontstaan uit een persoonlijke combinatie: een leven lang wakeboarden en een achtergrond in marketing, video en webontwikkeling."
      ),
      sections: [
        {
          title: "Waarom AdventureTravels",
          bodyHtml: ps([
            "Sport als reden om te gaan, comfort als reden om te blijven. Geen budget-backpacken, geen pure adrenalinemarketing.",
          ]),
        },
      ],
      extra: { portraitName: "Wouter Henneberke", portraitRole: "Owner", portraitImage: "" },
    },
    {
      slug: "vertrouwen",
      eyebrow: "Zekerheid",
      title: "Geregeld, zodat jij dat niet hoeft te doen.",
      subtitle: "",
      sections: [
        {
          title: "Betaling",
          bodyHtml: ps([
            "Je betaalt de volledige reissom bij boeking via iDEAL, creditcard of bankoverschrijving. Betalingen lopen via Mollie; wij slaan geen betaalgegevens op.",
          ]),
        },
        {
          title: "Annuleren",
          bodyHtml: ps([
            "Annuleren kan altijd. De staffel verschilt per park en staat op de reispagina, in de checkout en in je bevestigingsmail, zodat je vooraf precies weet wat een annulering kost.",
          ]),
        },
        {
          title: "Bedrijfsgegevens",
          bodyHtml: ps(["KvK-nummer en vestigingsplaats vind je in de algemene voorwaarden."]),
        },
      ],
      extra: {},
    },
    {
      slug: "voorwaarden",
      eyebrow: "Juridisch",
      title: "Algemene voorwaarden",
      subtitle: p(
        "Deze voorwaarden gelden voor alle reizen die via AdventureTravels worden geboekt. Ze zijn opgesteld in aanvulling op de wettelijke regels voor pakketreizen."
      ),
      sections: [
        {
          title: "Boeking",
          bodyHtml: ps([
            "Een boeking komt tot stand zodra de betaling via de betaalpagina is afgerond en AdventureTravels de boeking per e-mail bevestigt. De hoofdboeker is verantwoordelijk voor de juistheid van de opgegeven gegevens van alle deelnemers.",
            "De reis wordt uitgevoerd zoals beschreven op de reispagina op het moment van boeken. Het opgegeven niveau is indicatief: bij aankomst volgt een intake, waarna de begeleiding het programma op de groep afstemt.",
          ]),
        },
        {
          title: "Betaling",
          bodyHtml: ps([
            "Bij boeking betaal je de volledige reissom via iDEAL, creditcard of bankoverschrijving. Bij bankoverschrijving is de boeking pas definitief zodra het bedrag is ontvangen; blijft betaling uit, dan vervalt de boeking automatisch.",
            "Een vlucht die je op aanvraag door ons laat bijboeken, wordt apart geoffreerd en gefactureerd en maakt geen deel uit van de reissom op de reispagina.",
          ]),
        },
        {
          title: "Wijzigingen",
          bodyHtml: ps([
            "Wijzigingen op verzoek van de reiziger worden waar mogelijk doorgevoerd; eventuele meerkosten van leveranciers worden doorbelast. Een naamswijziging is mogelijk zolang de accommodatie en het park daarmee instemmen.",
            "AdventureTravels kan het programma aanpassen wanneer weer, waterstand of de veiligheid daartoe aanleiding geven. Bij een ingrijpende wijziging van de reis wordt een alternatief aangeboden of de reissom terugbetaald.",
          ]),
        },
        {
          title: "Annulering",
          bodyHtml: ps([
            "Annuleren kan altijd schriftelijk. De annuleringskosten volgen de staffel van het park waar je reis plaatsvindt. Die staffel staat op de reispagina en in de checkout, en wordt bij boeking vastgelegd in je bevestigingsmail; die versie is leidend.",
            "Wanneer wij een groepsreis annuleren omdat het minimum aantal deelnemers niet wordt gehaald, betalen wij de volledige reissom binnen veertien dagen terug.",
          ]),
        },
        {
          title: "Aansprakelijkheid",
          bodyHtml: ps([
            "Deelname aan de sportactiviteiten gebeurt op eigen risico. AdventureTravels is niet aansprakelijk voor schade die het gevolg is van het niet opvolgen van instructies van de begeleiding, van het gebruik van eigen materiaal, of van omstandigheden buiten haar invloed.",
            "De aansprakelijkheid is beperkt tot maximaal eenmaal de reissom, behoudens opzet of grove schuld.",
          ]),
        },
        {
          title: "Reisverzekering",
          bodyHtml: ps([
            "Een reisverzekering met dekking voor watersportactiviteiten is verplicht en is niet in de reissom inbegrepen. Een annuleringsverzekering wordt aanbevolen.",
            "De reiziger controleert zelf of de eigen polis de geboekte sport dekt. Op verzoek geven wij aan welke activiteit in de polisvoorwaarden moet worden opgenomen.",
          ]),
        },
        {
          title: "Klachten",
          bodyHtml: ps([
            "Een klacht wordt ter plaatse gemeld bij de begeleiding, zodat deze tijdens de reis kan worden opgelost. Is dat niet mogelijk, dan volgt schriftelijke melding binnen twee maanden na afloop van de reis via hallo@adventuretravels.nl.",
          ]),
        },
      ],
      extra: { versionNote: "Versie 2.0 · laatst bijgewerkt 2 september 2026" },
    },
    {
      slug: "privacy",
      eyebrow: "Juridisch",
      title: "Privacybeleid",
      subtitle: p(
        "Dit beleid beschrijft welke persoonsgegevens AdventureTravels verzamelt, waarvoor ze worden gebruikt en hoe lang ze worden bewaard."
      ),
      sections: [
        {
          title: "Welke gegevens worden verzameld",
          bodyHtml: ps([
            "Via de formulieren op de site: naam, e-mailadres, telefoonnummer en de inhoud van je vraag. Via het aanvragen van de programma-pdf: naam en e-mailadres, en alleen als je dat aanvinkt een nieuwsbriefinschrijving.",
            "Bij een boeking komen daar de gegevens bij die voor de uitvoering nodig zijn: adres van de hoofdboeker, voor- en achternaam en geboortedatum van alle deelnemers, het opgegeven sportniveau en eventuele dieetwensen voor de accommodatie.",
          ]),
          kind: "icons",
          data: ["Formulieren", "Programma-pdf", "Boekingsgegevens"],
        },
        {
          title: "Waarvoor ze gebruikt worden",
          bodyHtml: ps([
            "Contactgegevens gebruiken we om je vraag te beantwoorden en om een reis voor te bereiden en uit te voeren. Het e-mailadres uit de nieuwsbriefinschrijving gebruiken we uitsluitend voor de nieuwsbrief, met een afmeldlink in iedere verzending.",
            "We gebruiken geen persoonsgegevens voor geautomatiseerde besluitvorming of profilering, en verkopen geen gegevens aan derden.",
          ]),
        },
        {
          title: "Bewaartermijn",
          bodyHtml: ps([
            "Berichten uit de formulieren bewaren we twaalf maanden na het laatste contact. Boekingsgegevens bewaren we zeven jaar, omdat de fiscale bewaarplicht dat vereist. Nieuwsbriefgegevens bewaren we tot het moment van afmelden.",
          ]),
        },
        {
          title: "Delen met derden",
          bodyHtml: ps([
            "Voor de uitvoering van een reis delen we alleen de noodzakelijke gegevens met de accommodatie, de vervoerder en het cable park. Betalingen verlopen via Mollie, die de betaalgegevens onder eigen verwerkersvoorwaarden verwerkt. Nieuwsbriefinschrijvingen worden verwerkt door MailerLite.",
          ]),
        },
        {
          title: "Cookies en statistieken",
          bodyHtml: ps([
            "Analytische en marketingcookies plaatsen we pas nadat je daarvoor toestemming hebt gegeven in de cookiebanner. Je keuze kun je op elk moment aanpassen via de link onderaan de pagina.",
          ]),
        },
        {
          title: "Je rechten",
          bodyHtml: ps([
            "Je kunt je gegevens opvragen, laten wijzigen of laten verwijderen, en bezwaar maken tegen het gebruik ervan. Ook kun je vragen om je gegevens over te dragen. Wij reageren binnen een maand op zo'n verzoek.",
            "Verwijderen kan beperkt zijn zolang een fiscale bewaarplicht of een lopende boeking dat verhindert; in dat geval geven we aan welk deel wel kan worden verwijderd.",
          ]),
        },
        {
          title: "Contact voor privacyvragen",
          bodyHtml: ps([
            "Vragen over dit beleid of over je gegevens stel je via privacy@adventuretravels.nl. Ben je niet tevreden met de afhandeling, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.",
          ]),
        },
      ],
      extra: { versionNote: "Versie 2.0 · laatst bijgewerkt 2 september 2026 · privacy@adventuretravels.nl" },
    },
    {
      slug: "annuleringsvoorwaarden",
      eyebrow: "Juridisch",
      title: "Annuleringsvoorwaarden",
      subtitle: p(
        "Annuleren kan altijd. Wat het kost, hangt af van het park waar je reis plaatsvindt en van het moment waarop wij je schriftelijke annulering ontvangen."
      ),
      sections: [
        {
          title: "Staffel per park",
          bodyHtml: ps([
            "Elke reis heeft een eigen annuleringsstaffel, bepaald door de voorwaarden van het park en de accommodatie. Die staffel zie je op de reispagina, in stap 3 van de checkout en in je bevestigingsmail. De versie in je bevestigingsmail is de versie die voor jouw boeking geldt.",
            "De percentages zijn van de totale reissom per deelnemer. Het moment van annuleren is de datum waarop wij de schriftelijke annulering ontvangen.",
          ]),
        },
        {
          title: "Hoe je annuleert",
          bodyHtml: ps([
            "Annuleren gebeurt schriftelijk via hallo@adventuretravels.nl, met het boekingsnummer en de namen van de deelnemers die het betreft. Je ontvangt binnen twee werkdagen een bevestiging met het bedrag dat volgens de staffel wordt terugbetaald.",
            "Wordt een deel van de groep geannuleerd, dan kan de prijs per resterende deelnemer wijzigen wanneer de reis op groepsgrootte is gecalculeerd. Wij geven dat vóór verwerking van de annulering aan.",
          ]),
        },
        {
          title: "Vlucht",
          bodyHtml: ps([
            "Een vlucht die wij op jouw verzoek hebben bijgeboekt, valt onder de voorwaarden van de luchtvaartmaatschappij en niet onder de staffel van het park. Bij een groepsreis met vlucht inbegrepen staat dat in de staffel van die reis vermeld.",
          ]),
        },
        {
          title: "Reisverzekering",
          bodyHtml: ps([
            "Een annuleringsverzekering vergoedt in veel gevallen de annuleringskosten bij ziekte of andere gedekte omstandigheden. Sluit deze af op het moment van boeken; later afsluiten dekt gebeurtenissen vóór de ingangsdatum niet.",
            "Controleer of de polis de geboekte sport dekt. Wakeboarden valt bij sommige verzekeraars onder een aparte watersportdekking.",
          ]),
        },
        {
          title: "Annulering door ons",
          bodyHtml: ps([
            "Wanneer wij een reis annuleren, bijvoorbeeld omdat het minimum aantal deelnemers van een groepsreis niet wordt gehaald, bieden wij een alternatieve datum aan of betalen wij de volledige reissom binnen veertien dagen terug. Bij annulering door ons zijn geen kosten voor de reiziger verschuldigd.",
          ]),
        },
      ],
      extra: { versionNote: "Versie 2.0 · laatst bijgewerkt 2 september 2026" },
    },
  ];
  for (const page of pages) {
    if (await prisma.page.findUnique({ where: { slug: page.slug } })) {
      log("skipped", `page ${page.slug}`);
      continue;
    }
    await prisma.page.create({ data: page });
    log("created", `page ${page.slug}`);
  }

  // --- Site settings (singleton) ---
  if (!(await prisma.siteSettings.findUnique({ where: { id: "singleton" } }))) {
    await prisma.siteSettings.create({
      data: {
        id: "singleton",
        topbarTagline: "Kleine groepen · eigen gidsen · verblijf zelf getest",
        phone: "+31 20 244 18 60",
        email: "hallo@adventuretravels.nl",
        heroEyebrow: "Wakeboardreizen · Turkije",
        heroHeading: "Sport de hele dag.\nEet als een local.",
        heroSubheading: p("Verblijf, parkpas en transfer geregeld. Jij hoeft alleen te rijden."),
        trustStats: [],
        programCtaEyebrow: "Gratis · direct in je inbox",
        programCtaTitle: "Vraag het volledige programma aan",
        programCtaBody: p(
          "Dagindeling per reis, niveau-indicatie, het verblijf en de complete prijsopbouw. Zonder verkoopgesprek."
        ),
        newsletterTitle: "",
        footerTagline: "Actieve sportreizen met een verzorgde avond.",
      },
    });
    log("created", "siteSettings");
  } else {
    log("skipped", "siteSettings");
  }

  // --- Included items (homepage "Bij elke reis inbegrepen") ---
  const includedItems = [
    { icon: "house", title: "Verblijf", bodyHtml: p("Zelf getest, eigen kamer, ontbijt inbegrepen.") },
    { icon: "compass", title: "Gids ter plaatse", bodyHtml: p("Woont in het gebied en rijdt er het hele seizoen.") },
    { icon: "wave", title: "Parkpas", bodyHtml: p("Toegang tot het cable park voor de hele week.") },
    { icon: "pin", title: "Transfer", bodyHtml: p("Vervoer tussen het vliegveld en het verblijf.") },
  ];
  for (let i = 0; i < includedItems.length; i++) {
    const item = includedItems[i];
    if (await prisma.includedItem.findFirst({ where: { title: item.title } })) {
      log("skipped", `includedItem ${item.title}`);
      continue;
    }
    await prisma.includedItem.create({ data: { ...item, order: i } });
    log("created", `includedItem ${item.title}`);
  }

  // --- Trip types (homepage "Soorten reizen") ---
  // Alleen tegels zonder aantallen of prijzen: die kloppen alleen als ze uit de database komen.
  const tripTypes = [
    { href: "/reizen", icon: "wave", title: "Wakeboarden", meta: "Cable parks en boat-sessies" },
    { href: "/verblijf", icon: "house", title: "Verblijf & tafel", meta: "Bij elke reis inbegrepen" },
    { href: "/groepen-en-bedrijven/op-maat", icon: "compass", title: "Avontuur op maat", meta: "Voor groepen en bedrijven" },
    { href: "/contact", icon: "plane", title: "Vlucht", meta: "Op aanvraag bij te boeken" },
  ];
  for (let i = 0; i < tripTypes.length; i++) {
    const type = tripTypes[i];
    if (await prisma.tripType.findFirst({ where: { title: type.title } })) {
      log("skipped", `tripType ${type.title}`);
      continue;
    }
    await prisma.tripType.create({ data: { ...type, order: i } });
    log("created", `tripType ${type.title}`);
  }

  console.log("Seed klaar.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
