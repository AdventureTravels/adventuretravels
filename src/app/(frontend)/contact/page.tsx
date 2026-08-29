import type { Metadata } from 'next'

import { BookingConditions } from '@/components/BookingConditions'
import { ContactForm } from '@/components/ContactForm'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { ClockIcon, EnvelopeIcon, PhoneIcon } from '@/components/icons'

import '../styles.css'

export const metadata: Metadata = {
  title: 'Contact — AdventureTravels',
  description: 'Praat met iemand die zelf ook wakeboardt.',
}

export default function ContactPage() {
  return (
    <>
      <Nav />

      <section className="px-6 pb-10 pt-20 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-accent-label">
            Contact
          </span>
          <h1 className="max-w-3xl font-body text-4xl font-medium leading-tight tracking-[-0.02em] text-departure md:text-[52px] md:leading-[1.1]">
            Praat met iemand die zelf ook wakeboardt.
          </h1>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-[1fr_360px]">
          <ContactForm />

          <div className="flex flex-col gap-8">
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0 text-compass" />
                <span className="font-body text-sm font-light text-muted">
                  +31 20 244 18 60
                </span>
              </li>
              <li className="flex items-start gap-3">
                <EnvelopeIcon className="h-5 w-5 shrink-0 text-compass" />
                <span className="font-body text-sm font-light text-muted">
                  hallo@adventuretravels.nl
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="h-5 w-5 shrink-0 text-compass" />
                <span className="font-body text-sm font-light text-muted">
                  We reageren binnen 1 werkdag.
                </span>
              </li>
            </ul>

            <div className="relative h-[300px] w-full media-placeholder" />
          </div>
        </div>
      </section>

      <BookingConditions />

      <Footer />
    </>
  )
}
