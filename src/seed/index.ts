import { getPayload } from 'payload'

import config from '@payload-config'

type TextNode = {
  type: 'text'
  format: number
  style: string
  mode: 'normal'
  text: string
  detail: number
  version: 1
}

function text(value: string): TextNode {
  return { type: 'text', format: 0, style: '', mode: 'normal', text: value, detail: 0, version: 1 }
}

function paragraph(value: string) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [text(value)],
  }
}

function heading2(value: string) {
  return {
    type: 'heading',
    tag: 'h2',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [text(value)],
  }
}

function quote(value: string) {
  return {
    type: 'quote',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [text(value)],
  }
}

function richText(...nodes: Array<ReturnType<typeof paragraph | typeof heading2 | typeof quote>>) : any {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: nodes,
    },
  }
}

const run = async () => {
  const payload = await getPayload({ config })

  payload.logger.info('Seeding Wakeboardweek Antalya...')

  const sport = await payload.create({
    collection: 'sporten',
    data: {
      name: 'Wakeboarden',
      slug: 'wakeboarden',
      description:
        'Achter de kabel of achter de boot: wakeboarden combineert snelheid, techniek en een flinke dosis adrenaline.',
      forWho: richText(
        paragraph(
          'Wakeboarden is er voor iedereen die van actie houdt. Nooit gedaan? Onze instructeurs bouwen rustig op vanaf de basis. Al ervaring? Dan werk je gericht aan nieuwe tricks.',
        ),
      ),
      whatToExpect: richText(
        paragraph(
          'Elke dag sta je meerdere keren op het water, met persoonlijke feedback na iedere run. Materiaal van topmerken is inbegrepen.',
        ),
      ),
    },
  })

  const bestemming = await payload.create({
    collection: 'bestemmingen',
    data: {
      name: 'Turkije',
      slug: 'turkije',
      description: 'Antalya biedt jaarrond warm water en een van de beste kabelbanen van Europa.',
      whySpecial: richText(
        paragraph(
          'De baai van Antalya ligt beschut tegen wind, het water is glad als glas en de temperatuur blijft het hele jaar aangenaam.',
        ),
      ),
      flightTime: '3,5 uur',
      bestPeriod: 'April t/m oktober',
      sports: [sport.id],
    },
  })

  const trip = await payload.create({
    collection: 'reizen',
    data: {
      title: 'Wakeboardweek Antalya',
      slug: 'wakeboardweek-antalya',
      sport: sport.id,
      bestemming: bestemming.id,
      summary:
        '7 dagen wakeboarden op een van de beste kabelbanen van Europa, met warm water en zonzekerheid.',
      price: 895,
      priceUnit: 'p.p.',
      duration: '7 dagen',
      level: 'alle_niveaus',
      included: [
        { item: 'Verblijf op basis van halfpension' },
        { item: 'Onbeperkt wakeboarden op de kabelbaan' },
        { item: 'Volledige materiaaluitrusting' },
        { item: 'Begeleiding door ervaren instructeurs' },
      ],
      excluded: [{ item: 'Vluchten' }, { item: 'Reisverzekering' }],
      program: [
        { dag: 1, titel: 'Aankomst en intake', beschrijving: 'Aankomst, kennismaking en materiaal passen.' },
        { dag: 2, titel: 'Basistechniek', beschrijving: 'Opbouwen van houding en balans op de kabel.' },
        { dag: 3, titel: 'Eerste tricks', beschrijving: 'Introductie van de eerste sprongen.' },
        { dag: 4, titel: 'Rustdag', beschrijving: 'Vrije tijd om te herstellen of te verkennen.' },
        { dag: 5, titel: 'Verdieping', beschrijving: 'Verfijnen van techniek met persoonlijke feedback.' },
        { dag: 6, titel: 'Vrij wakeboarden', beschrijving: 'Alle geleerde technieken combineren.' },
        { dag: 7, titel: 'Vertrek', beschrijving: 'Ontbijt en vertrek richting huis.' },
      ],
      accommodationDescription: richText(
        paragraph(
          'Je verblijft op loopafstand van de kabelbaan, in comfortabele kamers met halfpension.',
        ),
      ),
      status: 'published',
    },
  })

  await payload.create({
    collection: 'journal',
    data: {
      title: 'Waarom Antalya jaarrond warm water heeft',
      slug: 'waarom-antalya-jaarrond-warm-water-heeft',
      category: { relationTo: 'bestemmingen', value: bestemming.id },
      excerpt:
        'De baai van Antalya heeft een unieke ligging die zorgt voor warm water, het hele jaar door.',
      body: richText(
        paragraph(
          'Antalya ligt beschut tussen bergen en zee, wat zorgt voor een mild microklimaat dat wakeboarders het hele jaar door kunnen benutten.',
        ),
        heading2('De ligging van de baai'),
        paragraph(
          'De baai wordt afgeschermd van overheersende winden, waardoor het water rustig en voorspelbaar blijft — ideaal voor een kabelbaan.',
        ),
        quote('Glad water, elke dag van het jaar — dat is wat Antalya uniek maakt.'),
        heading2('Wat dit betekent voor jouw reis'),
        paragraph(
          'Of je nu in april of in oktober boekt, je kunt rekenen op comfortabele omstandigheden om te wakeboarden.',
        ),
      ),
      publishedDate: new Date('2026-03-10').toISOString(),
      readingTime: '5 min',
    },
  })

  await payload.create({
    collection: 'journal',
    data: {
      title: 'Welke board past bij jouw niveau',
      slug: 'welke-board-past-bij-jouw-niveau',
      category: { relationTo: 'sporten', value: sport.id },
      excerpt: 'Van beginner tot gevorderd: de juiste board maakt het verschil in hoe snel je vooruitgaat.',
      body: richText(
        paragraph(
          'Een board dat past bij jouw niveau maakt leren makkelijker en tricks toegankelijker. Hieronder een kort overzicht.',
        ),
        heading2('Beginners'),
        paragraph(
          'Kies een breder, stabieler board. Dat geeft meer grip op het water en maakt opstaan eenvoudiger.',
        ),
        heading2('Gevorderde riders'),
        paragraph(
          'Een smaller board met meer flex geeft de wendbaarheid die nodig is voor sprongen en technische tricks.',
        ),
      ),
      publishedDate: new Date('2026-04-02').toISOString(),
      readingTime: '4 min',
    },
  })

  payload.logger.info(`Seed klaar: trip "${trip.title}" aangemaakt.`)
  process.exit(0)
}

await run().catch((error) => {
  console.error(error)
  process.exit(1)
})
