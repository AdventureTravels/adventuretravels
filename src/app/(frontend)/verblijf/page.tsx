import type { Metadata } from 'next'

import { BookingConditions } from '@/components/BookingConditions'
import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'

import '../styles.css'

export const metadata: Metadata = {
  title: 'Verblijf — AdventureTravels',
  description: 'Elke accommodatie in dit aanbod hebben we zelf bezocht en beoordeeld.',
}

export default function VerblijfPage() {
  return (
    <>
      <Nav />

      <section className="px-6 pb-10 pt-20 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-accent-label">
            Het concept
          </span>
          <h1 className="max-w-3xl font-body text-4xl font-medium leading-tight tracking-[-0.02em] text-departure md:text-[52px] md:leading-[1.1]">
            Zelf getest, of we boeken het niet.
          </h1>
          <p className="max-w-2xl font-body text-base font-light leading-relaxed text-muted md:text-[17px]">
            Elke accommodatie in dit aanbod hebben we zelf bezocht en beoordeeld — niet uit een
            catalogus geselecteerd.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative h-[420px] w-full media-placeholder" />
          <div className="relative h-[420px] w-full media-placeholder" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-px border-y border-line bg-line md:grid-cols-3">
        <div className="flex flex-col gap-4 bg-white px-8 py-14 md:px-10">
          <h2 className="font-body text-xl font-medium tracking-[-0.01em] text-departure">
            Het concept
          </h2>
          <p className="font-body text-sm font-light leading-relaxed text-muted">
            Sport is het doel van de dag, comfort is de reden om terug te keren — elke reis
            combineert een goed cable park met een verblijf waar je &apos;s avonds graag bent.
          </p>
        </div>
        <div className="flex flex-col gap-4 bg-white px-8 py-14 md:px-10">
          <h2 className="font-body text-xl font-medium tracking-[-0.01em] text-departure">
            Wat &apos;zelf getest&apos; betekent
          </h2>
          <p className="font-body text-sm font-light leading-relaxed text-muted">
            Persoonlijk bezoek, een vast aanspreekpunt ter plaatse en herbeoordeling van elke
            accommodatie voorafgaand aan elk seizoen.
          </p>
        </div>
        <div className="flex flex-col gap-4 bg-white px-8 py-14 md:px-10">
          <h2 className="font-body text-xl font-medium tracking-[-0.01em] text-departure">
            Type verblijf
          </h2>
          <p className="font-body text-sm font-light leading-relaxed text-muted">
            Parkaccommodaties dicht bij het cable park, zodat je minimale reistijd hebt tussen je
            kamer en het water.
          </p>
        </div>
      </div>

      <section className="bg-departure px-6 py-20 text-center md:px-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <h2 className="font-body text-3xl font-medium tracking-[-0.02em] text-white md:text-4xl">
            Bekijk welke reis bij dit verblijf hoort.
          </h2>
          <Button href="/reizen" variant="primary">
            Bekijk reizen
          </Button>
        </div>
      </section>

      <BookingConditions />

      <Footer />
    </>
  )
}
