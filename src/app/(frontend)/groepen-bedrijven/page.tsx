import type { Metadata } from 'next'

import { BookingConditions } from '@/components/BookingConditions'
import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { BuildingIcon, DocumentIcon, WatersportIcon } from '@/components/icons'

import '../styles.css'

export const metadata: Metadata = {
  title: 'Groepen & bedrijven — AdventureTravels',
  description: 'Drie manieren om samen op reis: met je eigen groep, volledig op maat, of als bedrijf.',
}

export default function GroepenBedrijvenPage() {
  return (
    <>
      <Nav />

      <section className="px-6 pb-10 pt-20 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-accent-label">
            Op maat
          </span>
          <h1 className="max-w-3xl font-body text-4xl font-medium leading-tight tracking-[-0.02em] text-departure md:text-[52px] md:leading-[1.1]">
            Niet alleen. Maar wel op maat.
          </h1>
          <p className="max-w-2xl font-body text-base font-light leading-relaxed text-muted md:text-[17px]">
            Drie manieren om samen op reis: met je eigen groep, volledig op maat, of als bedrijf.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-7 md:grid-cols-3">
          <div className="flex flex-col gap-4 border border-line bg-white p-8">
            <WatersportIcon className="h-9 w-9 text-compass" />
            <h2 className="font-body text-xl font-medium tracking-[-0.01em] text-departure">
              Groepsreizen
            </h2>
            <p className="font-body text-sm font-light leading-relaxed text-muted">
              Voor vriendengroepen en verenigingen die samen willen sporten.
            </p>
            <div className="pt-2">
              <Button href="/groepen-bedrijven/groepsreizen" variant="outline">
                Bekijk groepsreizen
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 border border-line bg-white p-8">
            <DocumentIcon className="h-9 w-9 text-compass" />
            <h2 className="font-body text-xl font-medium tracking-[-0.01em] text-departure">
              Op maat
            </h2>
            <p className="font-body text-sm font-light leading-relaxed text-muted">
              Een reis volledig naar eigen wens samengesteld.
            </p>
            <div className="pt-2">
              <Button href="/groepen-bedrijven/op-maat" variant="primary">
                Vraag reis op maat aan
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 border border-line bg-white p-8">
            <BuildingIcon className="h-9 w-9 text-compass" />
            <h2 className="font-body text-xl font-medium tracking-[-0.01em] text-departure">
              Bedrijven
            </h2>
            <p className="font-body text-sm font-light leading-relaxed text-muted">
              Teambuilding en incentive-reizen met een sportief programma.
            </p>
            <div className="pt-2">
              <Button href="/groepen-bedrijven/bedrijven" variant="primary">
                Vraag bedrijfsuitje aan
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-10">
          <h2 className="font-body text-3xl font-medium tracking-[-0.02em] text-departure">
            Hoe het werkt <span className="text-muted">(voorbeeld: groepsreizen)</span>
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="font-display text-3xl text-hatch">01</span>
              <h3 className="font-body text-lg font-medium text-departure">Aanvraag</h3>
              <p className="font-body text-sm font-light leading-relaxed text-muted">
                Gewenste sport, periode en groepsgrootte.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-display text-3xl text-hatch">02</span>
              <h3 className="font-body text-lg font-medium text-departure">Programma + offerte</h3>
              <p className="font-body text-sm font-light leading-relaxed text-muted">
                Wij stellen een voorstel op.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-display text-3xl text-hatch">03</span>
              <h3 className="font-body text-lg font-medium text-departure">Boeking</h3>
              <p className="font-body text-sm font-light leading-relaxed text-muted">
                Na akkoord dezelfde boekings- en betaalflow als een reguliere reis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BookingConditions />

      <Footer />
    </>
  )
}
