import type { Metadata } from 'next'

import { BookingConditions } from '@/components/BookingConditions'
import { Button } from '@/components/Button'
import { FilterBlock } from '@/components/FilterBlock'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { TripCard } from '@/components/TripCard'
import { getTrips } from '@/lib/data'

import '../styles.css'

export const metadata: Metadata = {
  title: 'Alle reizen — AdventureTravels',
  description:
    'Filter op sport, bestemming, periode en niveau — elke reis in dit overzicht is door onszelf getest.',
}

type SearchParams = { sport?: string; bestemming?: string; niveau?: string }

export default async function ReizenPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const trips = await getTrips({
    sportSlug: params.sport || undefined,
    bestemmingSlug: params.bestemming || undefined,
    level: params.niveau || undefined,
  })

  const hasResults = trips.length > 0

  return (
    <>
      <Nav />

      <section className="px-6 pb-10 pt-20 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-accent-label">
            Alle reizen
          </span>
          <h1 className="max-w-3xl font-body text-4xl font-medium leading-tight tracking-[-0.02em] text-departure md:text-[52px] md:leading-[1.1]">
            Kies je sport. De rest hebben we al voor je uitgezocht.
          </h1>
          <p className="max-w-2xl font-body text-base font-light leading-relaxed text-muted md:text-[17px]">
            Filter op sport, bestemming, periode en niveau — elke reis in dit overzicht is door
            onszelf getest.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <FilterBlock
            defaultSport={params.sport ?? ''}
            defaultBestemming={params.bestemming ?? ''}
            defaultNiveau={params.niveau ?? ''}
          />
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-7">
          <div className="flex items-baseline justify-between gap-8">
            <h2 className="font-body text-2xl font-medium tracking-[-0.02em] text-departure">
              {hasResults
                ? `${trips.length} ${trips.length === 1 ? 'reis' : 'reizen'} gevonden`
                : 'Geen reizen gevonden'}
            </h2>
            <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
              Sorteer op vertrekdatum
            </span>
          </div>

          {hasResults ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip.slug} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5 border border-line bg-white p-14">
              <svg
                width="38"
                height="38"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-compass"
              >
                <circle cx="21" cy="21" r="14" />
                <path d="M31 31 L42 42" />
                <path d="M15 21 H27" />
              </svg>
              <h3 className="font-body text-2xl font-medium tracking-[-0.02em] text-departure">
                Deze combinatie hebben we nog niet in het aanbod.
              </h3>
              <p className="max-w-lg font-body text-base font-light leading-relaxed text-muted">
                Verruim je filters of bekijk het volledige aanbod — of laat ons weten wat je zoekt,
                dan houden we je op de hoogte zodra het er is.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button href="/reizen" variant="primary">
                  Bekijk alle reizen
                </Button>
                <Button href="/contact" variant="outline">
                  Houd me op de hoogte
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <BookingConditions />

      <Footer />
    </>
  )
}
