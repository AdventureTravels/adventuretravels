import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { BookingConditions } from '@/components/BookingConditions'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { ArrowIcon } from '@/components/icons'
import { getAllBestemmingen } from '@/lib/data'
import type { Media } from '@/payload-types'

import '../styles.css'

export const metadata: Metadata = {
  title: 'Bestemmingen — AdventureTravels',
  description: 'Bij lancering één bestemming, gekozen om dezelfde reden als altijd.',
}

function resolveMediaUrl(media: unknown): string | null {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as Media).url ?? null
  }
  return null
}

const GRID_COLUMNS = 2

export default async function BestemmingenPage() {
  const bestemmingen = await getAllBestemmingen()
  const placeholderCount = Math.max(0, GRID_COLUMNS - bestemmingen.length)

  return (
    <>
      <Nav />

      <section className="px-6 pb-10 pt-20 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-accent-label">
            Waar we naartoe gaan
          </span>
          <h1 className="max-w-3xl font-body text-4xl font-medium leading-tight tracking-[-0.02em] text-departure md:text-[52px] md:leading-[1.1]">
            We beginnen bij de Turkse kust.
          </h1>
          <p className="max-w-2xl font-body text-base font-light leading-relaxed text-muted md:text-[17px]">
            Bij lancering één bestemming, gekozen om dezelfde reden als altijd: een goed cable
            park overdag, een verblijf waar je &apos;s avonds graag bent.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-7 md:grid-cols-2">
          {bestemmingen.map((bestemming) => {
            const imageUrl = resolveMediaUrl(bestemming.heroImage)
            return (
              <Link
                key={bestemming.slug}
                href={`/bestemmingen/${bestemming.slug}`}
                className="group flex flex-col"
              >
                <div className="relative h-[380px] w-full overflow-hidden media-placeholder">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={bestemming.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(20,23,15,0) 45%, rgba(20,23,15,0.68) 100%)',
                    }}
                  />
                  <span className="absolute bottom-6 left-6 font-body text-2xl font-medium text-white">
                    {bestemming.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-4">
                  {bestemming.description && (
                    <p className="font-body text-sm font-light leading-relaxed text-muted">
                      {bestemming.description}
                    </p>
                  )}
                  <span className="flex shrink-0 items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-departure">
                    Bekijk bestemming
                    <ArrowIcon className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            )
          })}
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={i}
              className="flex min-h-[380px] items-center justify-center border border-dashed border-line p-10 text-center"
            >
              <p className="max-w-xs font-body text-sm font-light leading-relaxed text-muted">
                Meer bestemmingen volgen
              </p>
            </div>
          ))}
        </div>
      </section>

      <BookingConditions />

      <Footer />
    </>
  )
}
