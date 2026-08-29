import type { Metadata } from 'next'

import { BookingConditions } from '@/components/BookingConditions'
import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'

import '../styles.css'

export const metadata: Metadata = {
  title: 'Over ons — AdventureTravels',
  description:
    'AdventureTravels is ontstaan uit een persoonlijke combinatie: een leven lang wakeboarden en een achtergrond in marketing, video en webontwikkeling.',
}

export default function OverOnsPage() {
  return (
    <>
      <Nav />

      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-6">
            <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-accent-label">
              Het verhaal
            </span>
            <h1 className="max-w-xl font-body text-4xl font-medium leading-tight tracking-[-0.02em] text-departure md:text-[48px] md:leading-[1.1]">
              Vijftien jaar op de kabel, nu ook achter de schermen.
            </h1>
            <p className="max-w-xl font-body text-base font-light leading-relaxed text-muted md:text-[17px]">
              AdventureTravels is ontstaan uit een persoonlijke combinatie: een leven lang
              wakeboarden en een achtergrond in marketing, video en webontwikkeling.
            </p>

            <div className="flex flex-col gap-4 pt-4">
              <h2 className="font-body text-2xl font-medium tracking-[-0.01em] text-departure">
                Waarom AdventureTravels
              </h2>
              <p className="max-w-xl font-body text-base font-light leading-relaxed text-muted">
                Sport als reden om te gaan, comfort als reden om te blijven. Geen
                budget-backpacken, geen pure adrenalinemarketing.
              </p>
            </div>

            <div className="pt-2">
              <Button href="/vertrouwen-zekerheid" variant="outline">
                Bekijk onze zekerheid
              </Button>
            </div>
          </div>

          <div className="relative min-h-[420px] w-full media-placeholder">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(20,23,15,0.7) 0%, rgba(20,23,15,0) 40%)',
              }}
            />
            <div className="absolute bottom-6 left-6 flex flex-col">
              <span className="font-body text-lg font-medium text-white">Wouter Henneberke</span>
              <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-canvas">
                Owner
              </span>
            </div>
          </div>
        </div>
      </section>

      <BookingConditions />

      <Footer />
    </>
  )
}
