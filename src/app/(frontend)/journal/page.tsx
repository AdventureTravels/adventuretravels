import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { BookingConditions } from '@/components/BookingConditions'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { ArrowIcon } from '@/components/icons'
import { getJournalEntries, resolveCategoryLabel } from '@/lib/data'
import type { Media } from '@/payload-types'

import '../styles.css'

export const metadata: Metadata = {
  title: 'Journal — AdventureTravels',
  description: 'Praktische inzichten en reisverhalen van het team en van gasten.',
}

function resolveMediaUrl(media: unknown): string | null {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as Media).url ?? null
  }
  return null
}

export default async function JournalPage() {
  const entries = await getJournalEntries()
  const placeholderCount = Math.max(0, 3 - entries.length)

  return (
    <>
      <Nav />

      <section className="px-6 pb-10 pt-20 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-accent-label">
            Verhalen
          </span>
          <h1 className="max-w-3xl font-body text-4xl font-medium leading-tight tracking-[-0.02em] text-departure md:text-[52px] md:leading-[1.1]">
            Verhalen van onderweg.
          </h1>
          <p className="max-w-2xl font-body text-base font-light leading-relaxed text-muted md:text-[17px]">
            Praktische inzichten en reisverhalen van het team en van gasten.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-7 md:grid-cols-3">
          {entries.map((entry) => {
            const imageUrl = resolveMediaUrl(entry.heroImage)
            const categoryLabel = resolveCategoryLabel(entry.category)
            return (
              <Link
                key={entry.slug}
                href={`/journal/${entry.slug}`}
                className="group flex flex-col overflow-hidden border border-line bg-card"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-hatch">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={entry.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-accent-label">
                    {categoryLabel && <span>{categoryLabel}</span>}
                    {categoryLabel && entry.readingTime && <span>&middot;</span>}
                    {entry.readingTime && <span>{entry.readingTime} leestijd</span>}
                  </div>
                  <h3 className="font-body text-xl font-medium leading-snug text-departure">
                    {entry.title}
                  </h3>
                  {entry.excerpt && (
                    <p className="font-body text-sm font-light leading-relaxed text-muted">
                      {entry.excerpt}
                    </p>
                  )}
                  <span className="mt-auto flex items-center gap-2 pt-2 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-departure">
                    Lees verder
                    <ArrowIcon className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={i}
              className="flex min-h-[300px] items-center justify-center border border-dashed border-line p-10 text-center"
            >
              <p className="max-w-xs font-body text-sm font-light leading-relaxed text-muted">
                Meer artikelen volgen
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
