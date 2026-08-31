import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function p(text: string) {
  return `<p>${text}</p>`;
}

function ps(texts: string[]) {
  return texts.map(p).join("");
}

async function main() {
  // --- Admin user ---
  const passwordHash = await bcrypt.hash("adventuretravels", 10);
  await prisma.adminUser.upsert({
    where: { email: "wouter@bureauberk.com" },
    update: {},
    create: { email: "wouter@bureauberk.com", passwordHash },
  });

  // --- Sport ---
  const sportData = {
    slug: "wakeboarden",
    name: "Wakeboarden",
    heroImage: "Herobeeld — rider achter de kabel",
    heroTitle: "Wakeboarden zoals het bedoeld is: veel water, weinig wachttijd.",
    heroSubtitle: p(
      "Cable parks met korte wachtrijen en boat-sessies met een instructeur die precies ziet waar je op vastloopt."
    ),
    cardImage: "Wakeboarden",
    caption: "Cable parks en boat-sessies. 1 reis · Turkije",
    order: 0,
  };
  const wakeboarden = await prisma.sport.upsert({
    where: { slug: "wakeboarden" },
    update: sportData,
    create: sportData,
  });

  // --- Destination ---
  const destinationData = {
    slug: "turkije",
    name: "Turkije",
    heroImage: "Herobeeld — cable park Antalya",
    heroTitle: "De cable parks aan de Turkse Riviera.",
    heroSubtitle: p(
      "Antalya en omgeving, met een partner-park dat we uit eigen ervaring kennen — meerdere weken achter elkaar getest, niet één keer bezocht."
    ),
    cardImage: "Turkije — cable park aan de kust",
    caption: "Antalya en omgeving · april tot oktober",
    flightTime: "4 uur",
    bestPeriod: "April — oktober",
    order: 0,
  };
  const turkije = await prisma.destination.upsert({
    where: { slug: "turkije" },
    update: destinationData,
    create: destinationData,
  });

  // --- Trip ---
  const tripData = {
    slug: "wakeboardweek-antalya",
    title: "Wakeboardweek Antalya",
    image: "Cable park Antalya",
    level: "Beginner tot gevorderd",
    category: "Turkije · wakeboarden",
    text: p("Vijf dagen op de kabel, verblijf bij het park inbegrepen. Vanaf € 890 p.p."),
    duration: "7 dagen",
    date: "April — oktober",
    price: "€ 890",
    priceNote: "p.p. incl. verblijf, pas & ontbijt",
    heroImage: "Herobeeld — cable park bij zonsondergang",
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
    stayImage: "Verblijf bij het park",
    galleryImages: ["Ochtend op het water", "Avond aan tafel"],
    fixedDepartureDate: null,
    order: 0,
    sportId: wakeboarden.id,
    destinationId: turkije.id,
  };
  await prisma.trip.upsert({
    where: { slug: "wakeboardweek-antalya" },
    update: tripData,
    create: tripData,
  });

  // --- Articles ---
  const antalyaArticleData = {
    slug: "antalya-warm-water",
    tag: "Turkije · 5 min",
    title: "Waarom Antalya jaarrond warm water heeft",
    excerpt: "Wat het seizoen bepaalt voor je sessies op de kabel.",
    heroImage: "Artikelbeeld — kust bij Antalya",
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
  };
  await prisma.article.upsert({
    where: { slug: "antalya-warm-water" },
    update: antalyaArticleData,
    create: antalyaArticleData,
  });

  const boardArticleData = {
    slug: "welke-board-past-bij-jouw-niveau",
    tag: "Materiaal · 4 min",
    title: "Welke board past bij jouw niveau",
    excerpt: "Praktisch overzicht voor beginners en gevorderden.",
    heroImage: "Herobeeld — boards op het ponton bij avondlicht",
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
  };
  await prisma.article.upsert({
    where: { slug: "welke-board-past-bij-jouw-niveau" },
    update: boardArticleData,
    create: boardArticleData,
  });

  // --- Reviews ---
  const reviews = [
    {
      stars: 5,
      quote: p(
        '"Ik boek normaal zelf alles. Hier hoefde ik alleen te beslissen of ik nog een run deed voordat we naar het dorp reden."'
      ),
      author: "Sanne T. — Gardameer, juni 2026",
    },
    {
      stars: 5,
      quote: p(
        '"Gids kende elke afdaling en elk restaurant. Wij fietsten acht dagen zonder één keer een route te hoeven zoeken."'
      ),
      author: "Joost & Maaike — Slovenië, juli 2026",
    },
    {
      stars: 4,
      quote: p(
        '"Als beginner was ik bang achterop te raken. Er waren twee niveaugroepen, dus dat viel volledig mee."'
      ),
      author: "Ewout D. — Costa Blanca, april 2026",
    },
  ];
  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];
    await prisma.review.deleteMany({ where: { author: r.author } });
    await prisma.review.create({ data: { ...r, order: i } });
  }

  // --- FAQ ---
  const faqs = [
    { question: "Hoe werkt de aanbetaling?", answer: p("15% van de reissom bij boeking, het restant vóór vertrek.") },
    {
      question: "Kan ik kosteloos annuleren?",
      answer: p("Tot 45 dagen voor vertrek, zie de annuleringsvoorwaarden voor de staffel daarna."),
    },
    {
      question: "Welk niveau heb ik nodig?",
      answer: p("Geen ervaring nodig — elke reis vermeldt het geschikte niveau."),
    },
    {
      question: "Ben ik verzekerd tijdens de sportactiviteit?",
      answer: p("Zie Vertrouwen & zekerheid voor de volledige dekking."),
    },
  ];
  for (let i = 0; i < faqs.length; i++) {
    const f = faqs[i];
    await prisma.faqItem.deleteMany({ where: { question: f.question } });
    await prisma.faqItem.create({ data: { ...f, order: i } });
  }

  // --- Pages ---
  const overOnsData = {
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
    extra: { portraitName: "Wouter Henneberke", portraitRole: "Owner", portraitImage: "Portret — oprichter op het water" },
  };
  await prisma.page.upsert({ where: { slug: "over-ons" }, update: overOnsData, create: overOnsData });

  const vertrouwenData = {
    slug: "vertrouwen",
    eyebrow: "Zekerheid",
    title: "Geregeld, zodat jij dat niet hoeft te doen.",
    subtitle: "",
    sections: [
      {
        title: "Garantiefonds",
        bodyHtml: ps([
          "Aangesloten bij VZR Garant — je boeking is gedekt, ook bij een eventueel faillissement, voor het volledige pakket.",
        ]),
      },
      {
        title: "Verzekering",
        bodyHtml: ps([
          "Aansprakelijkheidsverzekering afgesloten. Volledige voorwaarden zijn te vinden in de algemene voorwaarden.",
        ]),
      },
      {
        title: "Bedrijfsgegevens",
        bodyHtml: ps(["KvK-nummer, vestigingsplaats en eventueel ANVR-lidmaatschap zodra bevestigd."]),
      },
    ],
    extra: { badges: ["VZR Garant", "KvK"] },
  };
  await prisma.page.upsert({ where: { slug: "vertrouwen" }, update: vertrouwenData, create: vertrouwenData });

  const voorwaardenData = {
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
          "Een boeking komt tot stand zodra AdventureTravels de aanmelding schriftelijk bevestigt. De hoofdboeker is verantwoordelijk voor de juistheid van de opgegeven gegevens van alle deelnemers, en voor de betaling van de volledige reissom.",
          "De reis wordt uitgevoerd zoals beschreven op de reispagina op het moment van boeken. Het opgegeven niveau is indicatief: bij aankomst volgt een intake, waarna de begeleiding het programma op de groep afstemt.",
        ]),
      },
      {
        title: "Aanbetaling & betaling",
        bodyHtml: ps([
          "Bij boeking wordt 15% van de reissom in rekening gebracht als aanbetaling. Het restant is uiterlijk 30 dagen voor vertrek verschuldigd. Bij boekingen binnen 30 dagen voor vertrek wordt de volledige reissom direct gefactureerd.",
          "Betaling verloopt via de betaalprovider die op de betaalpagina wordt genoemd. Betalingen aan derden, waaronder het cable park of de accommodatie, gelden niet als betaling aan AdventureTravels.",
        ]),
        kind: "stats",
        data: [
          { value: "15%", label: "Aanbetaling bij boeking" },
          { value: "30", label: "Dagen voor vertrek: restant verschuldigd" },
        ],
      },
      {
        title: "Wijzigingen",
        bodyHtml: ps([
          "Wijzigingen op verzoek van de reiziger worden waar mogelijk doorgevoerd; eventuele meerkosten van leveranciers worden doorbelegd. Een naamswijziging is tot 14 dagen voor vertrek mogelijk, mits de accommodatie en het park daarmee instemmen.",
          "AdventureTravels kan het programma aanpassen wanneer weer, waterstand of de veiligheid daartoe aanleiding geven. Bij een ingrijpende wijziging van de reis wordt een alternatief aangeboden of de reissom terugbetaald.",
        ]),
      },
      {
        title: "Aansprakelijkheid",
        bodyHtml: ps([
          "Deelname aan de sportactiviteiten gebeurt op eigen risico. AdventureTravels is niet aansprakelijk voor schade die het gevolg is van het niet opvolgen van instructies van de begeleiding, van het gebruik van eigen materiaal, of van omstandigheden buiten haar invloed.",
          "De aansprakelijkheid is beperkt tot maximaal eenmaal de reissom, behoudens opzet of grove schuld. Voor de dekking van de afgesloten aansprakelijkheidsverzekering geldt de pagina Vertrouwen & zekerheid.",
        ]),
      },
      {
        title: "Reisverzekering",
        bodyHtml: ps([
          "Een reisverzekering met dekking voor wintersport- of watersportactiviteiten is verplicht en is niet in de reissom inbegrepen. Een annuleringsverzekering wordt aanbevolen, omdat de annuleringsstaffel na 45 dagen voor vertrek in werking treedt.",
          "De reiziger controleert zelf of de eigen polis de geboekte sport dekt. Op verzoek geven wij aan welke activiteit in de polisvoorwaarden moet worden opgenomen.",
        ]),
      },
      {
        title: "Klachten",
        bodyHtml: ps([
          "Een klacht wordt ter plaatse gemeld bij de begeleiding, zodat deze tijdens de reis kan worden opgelost. Is dat niet mogelijk, dan volgt schriftelijke melding binnen twee maanden na afloop van de reis via hallo@adventuretravels.nl.",
          "AdventureTravels is aangesloten bij de Stichting Garantiefonds voor Reisgelden VZR Garant. Bij een eventueel faillissement is de vooruitbetaalde reissom voor het volledige pakket gedekt via dat garantiefonds.",
        ]),
      },
    ],
    extra: {
      versionNote:
        "Versie 1.0 · laatst bijgewerkt 31 augustus 2026 · gedekt via VZR Garant · 15% aanbetaling, kosteloos annuleren tot 45 dagen voor vertrek.",
    },
  };
  await prisma.page.upsert({ where: { slug: "voorwaarden" }, update: voorwaardenData, create: voorwaardenData });

  const privacyData = {
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
          "Via het contactformulier: naam, e-mailadres, telefoonnummer, het gekozen onderwerp en de inhoud van het bericht. Via de nieuwsbriefinschrijving: alleen het e-mailadres en het moment van aanmelden.",
          "Bij een boeking komen daar de gegevens bij die voor de uitvoering nodig zijn: geboortedatum, paspoortnummer wanneer de bestemming dat vereist, het opgegeven sportniveau en eventuele dieetwensen voor de accommodatie.",
        ]),
        kind: "icons",
        data: ["Contactformulier", "Nieuwsbrief", "Boekingsgegevens"],
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
          "Berichten uit het contactformulier bewaren we twaalf maanden na het laatste contact. Boekingsgegevens bewaren we zeven jaar, omdat de fiscale bewaarplicht dat vereist. Nieuwsbriefgegevens bewaren we tot het moment van afmelden.",
        ]),
      },
      {
        title: "Delen met derden",
        bodyHtml: ps([
          "Voor de uitvoering van een reis delen we alleen de noodzakelijke gegevens met de accommodatie, de vervoerder en het cable park. Betalingen verlopen via de betaalprovider, die de betaalgegevens onder eigen verwerkersvoorwaarden verwerkt.",
          "Bij een verzekeringsclaim delen we de gegevens die de verzekeraar voor de behandeling nodig heeft. Met VZR Garant wisselen we uitsluitend gegevens uit wanneer een beroep op het garantiefonds wordt gedaan.",
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
          "Vragen over dit beleid of over je gegevens stel je via privacy@adventuretravels.nl of telefonisch op +31 20 244 18 60. Ben je niet tevreden met de afhandeling, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.",
        ]),
      },
    ],
    extra: { versionNote: "Versie 1.0 · laatst bijgewerkt 31 augustus 2026 · privacy@adventuretravels.nl" },
  };
  await prisma.page.upsert({ where: { slug: "privacy" }, update: privacyData, create: privacyData });

  const annuleringsvoorwaardenData = {
    slug: "annuleringsvoorwaarden",
    eyebrow: "Juridisch",
    title: "Annuleringsvoorwaarden",
    subtitle: p(
      "De kosten van een annulering hangen af van het moment waarop wij je schriftelijke annulering ontvangen. Tot 45 dagen voor vertrek annuleer je kosteloos."
    ),
    sections: [
      {
        title: "Staffel",
        bodyHtml: ps([
          "Onderstaande percentages zijn van de totale reissom per deelnemer. Het moment van annuleren is de datum waarop wij de schriftelijke annulering ontvangen, niet de datum waarop deze is verzonden.",
        ]),
        kind: "table",
        data: [
          { moment: "Meer dan 45 dagen", cost: "Kosteloos", free: true, note: "Volledige terugbetaling van de aanbetaling." },
          { moment: "45 tot 30 dagen", cost: "25%", note: "De aanbetaling wordt verrekend met de annuleringskosten." },
          { moment: "30 tot 14 dagen", cost: "60%", note: "Het reeds betaalde restant wordt gedeeltelijk terugbetaald." },
          { moment: "Minder dan 14 dagen", cost: "100%", note: "Geen terugbetaling; een annuleringsverzekering kan de kosten dekken." },
          { moment: "No-show bij vertrek", cost: "100%", note: "Ook wanneer een deel van de reis nog niet is gebruikt." },
        ],
      },
      {
        title: "Hoe je annuleert",
        bodyHtml: ps([
          "Annuleren gebeurt schriftelijk via hallo@adventuretravels.nl, met het boekingsnummer en de namen van de deelnemers die het betreft. Je ontvangt binnen twee werkdagen een bevestiging met het bedrag dat volgens de staffel verschuldigd is.",
          "Wordt een deel van de groep geannuleerd, dan kan de prijs per resterende deelnemer wijzigen wanneer de reis op groepsgrootte is gecalculeerd. Wij geven dat vóór verwerking van de annulering aan.",
        ]),
      },
      {
        title: "Boeking wijzigen",
        bodyHtml: ps([
          "Een verplaatsing naar een andere vertrekdatum in hetzelfde seizoen is tot 30 dagen voor vertrek mogelijk tegen de werkelijke kosten van de leveranciers, zonder dat de annuleringsstaffel in werking treedt. Daarna geldt een wijziging als annulering plus nieuwe boeking.",
          "Een naamswijziging is tot 14 dagen voor vertrek mogelijk, mits accommodatie en park daarmee instemmen. Dat is vaak voordeliger dan annuleren.",
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
          "Wanneer wij een reis annuleren, bijvoorbeeld omdat het minimum aantal deelnemers niet wordt gehaald, bieden wij een alternatieve datum aan of betalen wij de volledige reissom binnen veertien dagen terug. Bij annulering door ons zijn geen kosten voor de reiziger verschuldigd.",
        ]),
      },
    ],
    extra: {
      versionNote: "Versie 1.0 · laatst bijgewerkt 31 augustus 2026 · vragen over een annulering: +31 20 244 18 60",
    },
  };
  await prisma.page.upsert({
    where: { slug: "annuleringsvoorwaarden" },
    update: annuleringsvoorwaardenData,
    create: annuleringsvoorwaardenData,
  });

  // --- Site settings (singleton) ---
  const siteSettingsData = {
    id: "singleton",
    topbarTagline: "Kleine groepen · eigen gidsen · verblijf zelf getest",
    phone: "+31 20 244 18 60",
    email: "hallo@adventuretravels.nl",
    heroEyebrow: "Zomer 2027 — Alpen & meren",
    heroHeading: "Sport de hele dag.\nEet als een local.",
    heroSubheading: p("Kleine groepen, eigen gidsen, alles inbegrepen."),
    trustStats: [
      { value: "4,8", label: "gemiddeld uit 412 beoordelingen" },
      { value: "2.900", label: "reizigers sinds 2019" },
      { value: "MAX 12", label: "deelnemers per groep" },
      { value: "SGR", label: "& Calamiteitenfonds aangesloten" },
    ],
    programCtaEyebrow: "Gratis · direct in je inbox",
    programCtaTitle: "Vraag het volledige programma aan",
    programCtaBody: p(
      "Achttien pagina's met dagindeling per reis, niveau-indicatie, verblijven, menu's en de complete prijsopbouw. Zonder verkoopgesprek."
    ),
    newsletterTitle: "Eén reis per maand, uitgelicht in beeld en menu.",
    footerTagline: "Actieve sportreizen met een verzorgde avond. Vanuit Amsterdam, door heel Europa.",
  };
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: siteSettingsData,
    create: siteSettingsData,
  });

  // --- Included items (homepage "Bij elke reis inbegrepen") ---
  const includedItems = [
    { icon: "house", title: "Verblijf", bodyHtml: p("Zelf getest, eigen kamer, ontbijt inbegrepen.") },
    { icon: "compass", title: "Gids ter plaatse", bodyHtml: p("Woont in het gebied, rijdt en vaart er het hele seizoen.") },
    { icon: "wave", title: "Materiaal", bodyHtml: p("Boards, bikes, helmen en zekermateriaal staan klaar.") },
    { icon: "pin", title: "Transfers & diners", bodyHtml: p("Vervoer ter plaatse en vijf diners in het dorp.") },
  ];
  for (let i = 0; i < includedItems.length; i++) {
    const item = includedItems[i];
    await prisma.includedItem.deleteMany({ where: { title: item.title } });
    await prisma.includedItem.create({ data: { ...item, order: i } });
  }

  // --- Trip types (homepage "Soorten reizen") ---
  const tripTypes = [
    { href: "/reizen", icon: "wave", title: "Watersport", meta: "9 reizen · v.a. € 1.680" },
    { href: "/reizen", icon: "mountainbike", title: "Mountainbike", meta: "6 reizen · v.a. € 1.890" },
    { href: "/reizen", icon: "level", title: "Bergsport", meta: "7 reizen · v.a. € 1.940" },
    { href: "/verblijf", icon: "house", title: "Verblijf & tafel", meta: "Bij elke reis inbegrepen" },
    { href: "/bestemmingen", icon: "pin", title: "Bestemmingen", meta: "8 landen" },
    { href: "/groepen-en-bedrijven/op-maat", icon: "compass", title: "Avontuur op maat", meta: "Privégroepen vanaf 6" },
    { href: "/reizen", icon: "calendar", title: "Seizoenen", meta: "Maart tot oktober" },
    { href: "/contact", icon: "plane", title: "Vlucht & transfer", meta: "Optioneel bij te boeken" },
  ];
  for (let i = 0; i < tripTypes.length; i++) {
    const type = tripTypes[i];
    await prisma.tripType.deleteMany({ where: { title: type.title } });
    await prisma.tripType.create({ data: { ...type, order: i } });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
