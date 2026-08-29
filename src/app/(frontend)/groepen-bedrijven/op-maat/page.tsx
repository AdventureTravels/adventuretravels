import type { Metadata } from 'next'
import Link from 'next/link'

import { AanvraagForm } from '@/components/AanvraagForm'
import { BookingConditions } from '@/components/BookingConditions'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { CheckCircleIcon, PhoneIcon } from '@/components/icons'
import { getAllSporten } from '@/lib/data'

import '../../styles.css'

export const metadata: Metadata = {
  title: 'Reis op maat — AdventureTravels',
  description:
    'Een reis volledig naar eigen wens samengesteld — sport, verblijf, duur en tempo bepalen jullie.',
}

export default async function OpMaatPage() {
  const sporten = await getAllSporten()
  const sportOptions = sporten.map((sport) => ({ label: sport.name, value: sport.slug }))

  return (
    <>
      <Nav />

      <section className="px-6 pb-10 pt-20 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
          <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            <Link href="/groepen-bedrijven" className="hover:text-departure">
              Groepen &amp; bedrijven
            </Link>{' '}
            &middot; Op maat
          </span>
          <h1 className="max-w-3xl font-body text-4xl font-medium leading-tight tracking-[-0.02em] text-departure md:text-[52px] md:leading-[1.1]">
            Een reis die precies om jullie heen is gebouwd.
          </h1>
          <p className="max-w-2xl font-body text-base font-light leading-relaxed text-muted md:text-[17px]">
            Een reis volledig naar eigen wens samengesteld — sport, verblijf, duur en tempo
            bepalen jullie.
          </p>
          <div className="flex flex-wrap gap-6 pt-1 font-body text-[11px] font-medium uppercase tracking-[0.14em] text-departure">
            <span>Vanaf 2 personen</span>
            <span>Jaarrond</span>
            <span>Alle niveaus</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-px border-y border-line bg-line md:grid-cols-2">
        <div className="flex flex-col gap-4 bg-white px-8 py-14 md:px-14">
          <h2 className="font-body text-[28px] font-medium tracking-[-0.02em] text-departure">
            Voor wie
          </h2>
          <p className="max-w-xl font-body text-base font-light leading-relaxed text-muted">
            Voor wie geen standaardvertrek wil, maar een reis die precies aansluit op eigen wensen
            en tempo.
          </p>
        </div>
        <div className="flex flex-col gap-4 bg-white px-8 py-14 md:px-14">
          <h2 className="font-body text-[28px] font-medium tracking-[-0.02em] text-departure">
            Wat we vastleggen
          </h2>
          <p className="max-w-xl font-body text-base font-light leading-relaxed text-muted">
            Sport, verblijf, duur en tempo — alles wordt samen met jou vastgelegd voordat we
            boeken.
          </p>
        </div>
      </div>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-10">
          <h2 className="font-body text-3xl font-medium tracking-[-0.02em] text-departure">
            Hoe het werkt
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            <div className="flex flex-col gap-3">
              <span className="font-display text-3xl text-hatch">01</span>
              <h3 className="font-body text-lg font-medium text-departure">Intakegesprek</h3>
              <p className="font-body text-sm font-light leading-relaxed text-muted">
                We bespreken wensen, niveau en periode.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-display text-3xl text-hatch">02</span>
              <h3 className="font-body text-lg font-medium text-departure">Voorstel op maat</h3>
              <p className="font-body text-sm font-light leading-relaxed text-muted">
                Wij stellen een reis samen die past.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-display text-3xl text-hatch">03</span>
              <h3 className="font-body text-lg font-medium text-departure">Bijstellen</h3>
              <p className="font-body text-sm font-light leading-relaxed text-muted">
                We passen het voorstel aan tot het klopt.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-display text-3xl text-hatch">04</span>
              <h3 className="font-body text-lg font-medium text-departure">Boeking</h3>
              <p className="font-body text-sm font-light leading-relaxed text-muted">
                Na akkoord leggen we de reis vast.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-[1fr_360px]">
          <AanvraagForm
            type="op-maat"
            groupSizeLabel="Aantal personen"
            groupSizePlaceholder="Bijv. 2 — 4 personen"
            submitLabel="Vraag reis op maat aan"
            sportOptions={sportOptions}
          />

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 bg-departure p-8 text-white">
              <h3 className="font-body text-lg font-medium">Liever eerst even bellen?</h3>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0" />
                <span className="font-body text-sm font-light text-dune">+31 20 244 18 60</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 border border-line bg-white p-8">
              <h3 className="font-body text-lg font-medium text-departure">Na je aanvraag</h3>
              <ul className="flex flex-col gap-3">
                {[
                  'We plannen een intakegesprek in.',
                  'We stellen een voorstel op maat op.',
                  'We stellen bij totdat het klopt.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-trail" />
                    <span className="font-body text-sm font-light leading-relaxed text-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <BookingConditions />

      <Footer />
    </>
  )
}
