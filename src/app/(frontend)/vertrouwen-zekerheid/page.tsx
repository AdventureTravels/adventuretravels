import type { Metadata } from 'next'

import { BookingConditions } from '@/components/BookingConditions'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { BuildingIcon, DocumentIcon, ShieldIcon } from '@/components/icons'

import '../styles.css'

export const metadata: Metadata = {
  title: 'Vertrouwen & zekerheid — AdventureTravels',
  description: 'Geregeld, zodat jij dat niet hoeft te doen.',
}

export default function VertrouwenZekerheidPage() {
  return (
    <>
      <Nav />

      <section className="px-6 pb-10 pt-20 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-accent-label">
            Zekerheid
          </span>
          <h1 className="max-w-3xl font-body text-4xl font-medium leading-tight tracking-[-0.02em] text-departure md:text-[52px] md:leading-[1.1]">
            Geregeld, zodat jij dat niet hoeft te doen.
          </h1>
        </div>
      </section>

      <section className="px-6 pb-10 md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-7 md:grid-cols-3">
          <div className="flex flex-col gap-4 border border-line bg-white p-8">
            <ShieldIcon className="h-9 w-9 text-compass" />
            <h2 className="font-body text-xl font-medium tracking-[-0.01em] text-departure">
              Garantiefonds
            </h2>
            <p className="font-body text-sm font-light leading-relaxed text-muted">
              Aangesloten bij VZR Garant — je boeking is gedekt, ook bij een eventueel
              faillissement, voor het volledige pakket.
            </p>
          </div>
          <div className="flex flex-col gap-4 border border-line bg-white p-8">
            <DocumentIcon className="h-9 w-9 text-compass" />
            <h2 className="font-body text-xl font-medium tracking-[-0.01em] text-departure">
              Verzekering
            </h2>
            <p className="font-body text-sm font-light leading-relaxed text-muted">
              Aansprakelijkheidsverzekering afgesloten. Volledige voorwaarden zijn te vinden in de
              algemene voorwaarden.
            </p>
          </div>
          <div className="flex flex-col gap-4 border border-line bg-white p-8">
            <BuildingIcon className="h-9 w-9 text-compass" />
            <h2 className="font-body text-xl font-medium tracking-[-0.01em] text-departure">
              Bedrijfsgegevens
            </h2>
            <p className="font-body text-sm font-light leading-relaxed text-muted">
              KvK-nummer, vestigingsplaats en eventueel ANVR-lidmaatschap zodra bevestigd.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto flex max-w-[1400px] gap-3 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
          <span className="border border-line px-3 py-2">VZR GARANT</span>
          <span className="border border-line px-3 py-2">KVK</span>
        </div>
      </section>

      <BookingConditions />

      <Footer />
    </>
  )
}
