import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { BookingConditions } from '@/components/BookingConditions'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { ArrowIcon } from '@/components/icons'
import { getAllSporten } from '@/lib/data'
import type { Media } from '@/payload-types'

import '../styles.css'

export const metadata: Metadata = {
  title: 'Onze sporten — AdventureTravels',
  description: 'We beginnen met de sport die AdventureTravels heeft laten ontstaan.',
}

function resolveMediaUrl(media: unknown): string | null {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as Media).url ?? null
  }
  return null
}

const GRID_COLUMNS = 4

export default async function SportenPage() {
  const sporten = await getAllSporten()
  const placeholderCount = Math.max(0, GRID_COLUMNS - sporten.length)

  return (
    <>
      <Nav />

      <section className="px-6 pb-10 pt-20 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-accent-label">
            Onze sporten
          </span>
          <h1 className="max-w-3xl font-body text-4xl font-medium leading-tight tracking-[-0.02em] text-departure md:text-[52px] md:leading-[1.1]">
            Wakeboarden. De rest volgt.
          </h1>
          <p className="max-w-2xl font-body text-base font-light leading-relaxed text-muted md:text-[17px]">
            We beginnen met de sport die AdventureTravels heeft laten ontstaan. Andere sporten
            worden na lancering toegevoegd.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sporten.map((sport) => {
            const imageUrl = resolveMediaUrl(sport.heroImage)
            return (
              <Link key={sport.slug} href={`/sporten/${sport.slug}`} className="group flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden media-placeholder">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={sport.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(20,23,15,0) 45%, rgba(20,23,15,0.66) 100%)',
                    }}
                  />
                  <span className="absolute bottom-4 left-5 font-body text-xl font-medium text-white">
                    {sport.name}
                  </span>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  {sport.description && (
                    <p className="font-body text-sm font-light leading-relaxed text-muted">
                      {sport.description}
                    </p>
                  )}
                  <span className="flex items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-departure">
                    Bekijk sport
                    <ArrowIcon className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            )
          })}
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-[4/3] items-center justify-center border border-dashed border-line p-8"
            >
              <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Volgt later
              </span>
            </div>
          ))}
        </div>
      </section>

      <BookingConditions />

      <Footer />
    </>
  )
}
