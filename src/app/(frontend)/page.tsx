import { Button } from '@/components/Button'
import { FilterBlock } from '@/components/FilterBlock'
import { Footer } from '@/components/Footer'
import { JournalCard } from '@/components/JournalCard'
import { Nav } from '@/components/Nav'
import { TripCard } from '@/components/TripCard'
import { TrustStrip } from '@/components/TrustStrip'
import {
  AvontuurIcon,
  BestemmingIcon,
  SeizoenIcon,
  VerblijfIcon,
} from '@/components/icons'
import { getFeaturedTrips, getJournalEntries } from '@/lib/data'

import './styles.css'

const includedItems = [
  { icon: AvontuurIcon, title: 'Ervaren instructeurs', text: 'Gecertificeerde begeleiding op elk niveau.' },
  { icon: VerblijfIcon, title: 'Verblijf inbegrepen', text: 'Zorgvuldig geselecteerde accommodaties.' },
  { icon: BestemmingIcon, title: 'Kleine groepen', text: 'Maximaal 12 deelnemers per reis.' },
  { icon: SeizoenIcon, title: 'Beste seizoen', text: 'Reizen gepland op het optimale moment.' },
]

const sportCategories = [
  { name: 'Wakeboarden', href: '/sporten/wakeboarden' },
]

const reviews = [
  {
    name: 'Sanne V.',
    text: 'Een week vol adrenaline en goede sfeer. De begeleiding was top en het niveau werd precies goed ingeschat.',
  },
  {
    name: 'Tom B.',
    text: 'Alles tot in de puntjes geregeld. Kwam als beginner en ging naar huis met een backside 180.',
  },
  {
    name: 'Iris & Daan',
    text: 'Perfecte mix van sport en ontspanning. We boeken zeker nog een keer.',
  },
]

export default async function HomePage() {
  const [featuredTrips, journalEntries] = await Promise.all([
    getFeaturedTrips(4),
    getJournalEntries(3),
  ])

  return (
    <>
      <Nav variant="transparent" />

      <section className="relative flex min-h-[92vh] flex-col justify-end overflow-hidden media-placeholder">
        <div className="absolute inset-0 bg-departure/40" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 pb-28 pt-40 md:px-10">
          <span className="font-body text-[11px] font-medium uppercase tracking-[0.18em] text-canvas/80">
            Actieve sportreizen
          </span>
          <h1 className="max-w-2xl font-display text-[40px] leading-[1.1] tracking-[-0.02em] text-canvas md:text-[52px] md:leading-[1.08] md:tracking-[-0.03em]">
            Wij organiseren de reis. Jij levert de adrenaline.
          </h1>
          <p className="max-w-lg font-body text-base font-light leading-relaxed text-canvas/85">
            Wakeboardreizen voor mensen die liever bewegen dan liggen. Georganiseerd met oog voor
            veiligheid, kwaliteit en avontuur — van beginner tot gevorderd.
          </p>
        </div>

        <div className="relative z-10 -mb-16 flex justify-center px-6 md:justify-start md:px-10">
          <FilterBlock title="Waar wil je heen?" className="max-w-3xl" />
        </div>
      </section>

      <section className="bg-compass px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <p className="font-display text-sm uppercase tracking-[0.14em] text-canvas">
            Vaste vertrekdata &middot; Kleine groepen &middot; Alle niveaus welkom
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
        <TrustStrip />
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-accent-label">
              Uitgelicht
            </span>
            <h2 className="max-w-xl font-body text-3xl font-medium leading-tight text-departure md:text-[38px] md:leading-[1.2] md:tracking-[-0.02em]">
              Onze populairste reizen
            </h2>
          </div>
          <Button href="/reizen" variant="outline">
            Alle reizen
          </Button>
        </div>

        {featuredTrips.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredTrips.map((trip) => (
              <TripCard key={trip.slug} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="border border-line bg-card px-8 py-16 text-center">
            <p className="font-body text-base font-light text-muted">
              Er zijn nog geen reizen gepubliceerd. Kom snel terug voor het eerste aanbod.
            </p>
          </div>
        )}
      </section>

      <section className="bg-trail px-6 py-20 text-canvas md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-2">
          <div className="flex flex-col justify-center gap-6">
            <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-canvas/70">
              Overdag &amp; 's avonds
            </span>
            <h2 className="font-body text-3xl font-medium leading-tight md:text-[38px] md:leading-[1.2] md:tracking-[-0.02em]">
              Trainen op het water, bijkomen aan de kade
            </h2>
            <p className="max-w-md font-body text-base font-light leading-relaxed text-canvas/80">
              Overdag sessies onder begeleiding op de kabelbaan, 's avonds gezamenlijke diners en
              tijd om op adem te komen. Geen ingewikkelde logistiek — wij regelen het.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] media-placeholder" />
            <div className="mt-8 aspect-[3/4] media-placeholder" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
        <div className="mb-10 flex flex-col gap-4">
          <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-accent-label">
            Inbegrepen
          </span>
          <h2 className="max-w-xl font-body text-3xl font-medium leading-tight text-departure md:text-[38px] md:leading-[1.2] md:tracking-[-0.02em]">
            Alles geregeld, jij focust op de sport
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {includedItems.map((item) => (
            <div key={item.title} className="flex flex-col gap-4 bg-paper px-6 py-8">
              <item.icon className="h-8 w-8 text-departure" />
              <h3 className="font-body text-base font-medium text-departure">{item.title}</h3>
              <p className="font-body text-sm font-light leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
        <div className="mb-10 flex flex-col gap-4">
          <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-accent-label">
            Soorten reizen
          </span>
          <h2 className="max-w-xl font-body text-3xl font-medium leading-tight text-departure md:text-[38px] md:leading-[1.2] md:tracking-[-0.02em]">
            Kies je sport
          </h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {sportCategories.map((sport) => (
            <a
              key={sport.href}
              href={sport.href}
              className="group relative flex h-64 w-80 flex-none flex-col justify-end overflow-hidden media-placeholder"
            >
              <div className="absolute inset-0 bg-departure/30 transition-colors group-hover:bg-departure/45" />
              <span className="relative z-10 p-6 font-body text-lg font-medium text-canvas">
                {sport.name}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-departure px-6 py-20 text-canvas md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-6">
            <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-canvas/70">
              Nog twijfels?
            </span>
            <h2 className="font-body text-3xl font-medium leading-tight md:text-[38px] md:leading-[1.2] md:tracking-[-0.02em]">
              Download het volledige programma
            </h2>
            <p className="max-w-md font-body text-base font-light leading-relaxed text-canvas/80">
              Bekijk het dagprogramma, de accommodatie en alle praktische details in één overzicht.
            </p>
          </div>
          <div>
            <Button href="/contact" variant="outline-light">
              Vraag programma aan
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
        <div className="mb-10 flex flex-col gap-4">
          <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-accent-label">
            Ervaringen
          </span>
          <h2 className="max-w-xl font-body text-3xl font-medium leading-tight text-departure md:text-[38px] md:leading-[1.2] md:tracking-[-0.02em]">
            Wat reizigers zeggen
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.name} className="flex flex-col gap-4 border border-line bg-card p-6">
              <p className="font-body text-sm font-light leading-relaxed text-departure">
                &ldquo;{review.text}&rdquo;
              </p>
              <span className="font-body text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                {review.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-compass px-6 py-16 text-canvas md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <h2 className="font-body text-2xl font-medium leading-tight">
              Als eerste op de hoogte van nieuwe reizen
            </h2>
            <p className="font-body text-sm font-light text-canvas/85">
              Geen spam, alleen nieuwe bestemmingen en vroegboekvoordeel.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              placeholder="Je e-mailadres"
              className="w-full border border-canvas bg-transparent px-4 py-3 font-body text-sm text-canvas placeholder:text-canvas/60 focus:outline-none"
            />
            <Button type="submit" variant="dark">
              Aanmelden
            </Button>
          </form>
        </div>
      </section>

      {journalEntries.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4">
              <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-accent-label">
                Journal
              </span>
              <h2 className="max-w-xl font-body text-3xl font-medium leading-tight text-departure md:text-[38px] md:leading-[1.2] md:tracking-[-0.02em]">
                Verhalen van onderweg
              </h2>
            </div>
            <Button href="/journal" variant="outline">
              Alle artikelen
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {journalEntries.map((entry) => (
              <JournalCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}
