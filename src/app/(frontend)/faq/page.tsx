import type { Metadata } from 'next'

import { Accordion } from '@/components/Accordion'
import { BookingConditions } from '@/components/BookingConditions'
import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'

import '../styles.css'

export const metadata: Metadata = {
  title: 'Veelgestelde vragen — AdventureTravels',
  description: 'Praktische antwoorden over aanbetaling, annuleren, niveau en verzekering.',
}

const faqItems = [
  {
    question: 'Hoe werkt de aanbetaling?',
    answer:
      'Je betaalt 15% van de reissom bij boeking. Het restant voldoe je vóór vertrek, ruim op tijd voor je reis.',
  },
  {
    question: 'Kan ik kosteloos annuleren?',
    answer: 'Tot 45 dagen voor vertrek kun je kosteloos annuleren.',
  },
  {
    question: 'Welk niveau heb ik nodig?',
    answer:
      'Geen ervaring nodig — elke reis vermeldt het niveau dat wordt gevraagd, van beginner tot gevorderd.',
  },
  {
    question: 'Ben ik verzekerd tijdens de sportactiviteit?',
    answer: 'Zie Vertrouwen & zekerheid voor de volledige dekking en voorwaarden.',
  },
]

export default function FaqPage() {
  return (
    <>
      <Nav />

      <section className="px-6 pb-10 pt-20 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-accent-label">
            Praktisch
          </span>
          <h1 className="max-w-3xl font-body text-4xl font-medium leading-tight tracking-[-0.02em] text-departure md:text-[52px] md:leading-[1.1]">
            Veelgestelde vragen
          </h1>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-[1fr_400px]">
          <Accordion items={faqItems} />

          <div className="flex h-fit flex-col gap-4 bg-departure p-8 text-white">
            <h2 className="font-body text-xl font-medium tracking-[-0.01em]">
              Vraag er niet tussen?
            </h2>
            <p className="font-body text-sm font-light leading-relaxed text-dune">
              Stel je vraag rechtstreeks aan iemand die zelf ook wakeboardt.
            </p>
            <div className="pt-2">
              <Button href="/contact" variant="primary">
                Naar contact
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BookingConditions />

      <Footer />
    </>
  )
}
