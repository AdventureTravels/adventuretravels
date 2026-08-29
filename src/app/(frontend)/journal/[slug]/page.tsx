import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BookingConditions } from '@/components/BookingConditions'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { PhoneIcon } from '@/components/icons'
import { getJournalBySlug, getTrips, resolveCategoryLabel } from '@/lib/data'
import { extractH2Headings, journalConverters } from '@/lib/richTextHeadings'
import { TripCard } from '@/components/TripCard'
import type { Media } from '@/payload-types'

import '../../styles.css'

type PageProps = { params: Promise<{ slug: string }> }

function resolveMediaUrl(media: unknown): string | null {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as Media).url ?? null
  }
  return null
}

function formatDate(date: string | null | undefined): string | null {
  if (!date) return null
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(date),
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const entry = await getJournalBySlug(slug)
  if (!entry) return {}
  return {
    title: `${entry.title} — AdventureTravels`,
    description: entry.excerpt ?? undefined,
  }
}

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params
  const entry = await getJournalBySlug(slug)

  if (!entry) {
    notFound()
  }

  const heroUrl = resolveMediaUrl(entry.heroImage)
  const categoryLabel = resolveCategoryLabel(entry.category)
  const publishedDate = formatDate(entry.publishedDate)
  const headings = extractH2Headings(entry.body)

  const category = entry.category
  const bestemmingSlug =
    category && 'relationTo' in category && category.relationTo === 'bestemmingen' && category.value
      ? (category.value as { slug: string }).slug
      : undefined
  const sportSlug =
    category && 'relationTo' in category && category.relationTo === 'sporten' && category.value
      ? (category.value as { slug: string }).slug
      : undefined
  const relatedTrips =
    bestemmingSlug || sportSlug ? await getTrips({ bestemmingSlug, sportSlug }) : []

  return (
    <>
      <div className="relative h-[560px] w-full media-placeholder">
        {heroUrl && <Image src={heroUrl} alt={entry.title} fill priority className="object-cover" />}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(20,23,15,0.55) 0%, rgba(20,23,15,0.12) 30%, rgba(20,23,15,0.10) 46%, rgba(20,23,15,0.70) 100%)',
          }}
        />
        <Nav variant="transparent" />

        <div className="absolute bottom-14 left-6 z-10 flex max-w-3xl flex-col gap-4 md:left-12">
          <div className="flex flex-wrap gap-4 font-body text-[11px] font-medium uppercase tracking-[0.14em] text-canvas">
            {categoryLabel && <span>{categoryLabel}</span>}
            {entry.readingTime && <span>{entry.readingTime} leestijd</span>}
            {publishedDate && <span>{publishedDate}</span>}
          </div>
          <h1 className="font-body text-[36px] font-medium leading-[1.15] tracking-[-0.02em] text-white md:text-[48px] md:leading-[1.1]">
            {entry.title}
          </h1>
        </div>
      </div>

      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-[1fr_320px]">
          <div className="max-w-2xl font-body text-base font-light leading-relaxed text-muted [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-compass [&_blockquote]:pl-5 [&_blockquote]:font-body [&_blockquote]:italic [&_blockquote]:text-departure [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-body [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-[-0.01em] [&_h2]:text-departure [&_p]:mb-4">
            {entry.excerpt && <p className="mb-6 text-lg text-departure">{entry.excerpt}</p>}
            <RichText data={entry.body as any} converters={journalConverters} />
          </div>

          <div className="flex h-fit flex-col gap-6 md:sticky md:top-24">
            {headings.length > 0 && (
              <div className="flex flex-col gap-3 border border-line bg-white p-6">
                <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-departure">
                  In dit artikel
                </span>
                <ul className="flex flex-col gap-2">
                  {headings.map((heading, index) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className={`font-body text-sm leading-snug ${
                          index === 0 ? 'font-medium text-departure' : 'font-light text-muted'
                        } hover:text-departure`}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3 bg-departure p-6 text-white">
              <h3 className="font-body text-base font-medium">Vraag het aan een gids</h3>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0" />
                <span className="font-body text-sm font-light text-dune">+31 20 244 18 60</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-7">
          <div className="flex items-center justify-between">
            <h2 className="font-body text-3xl font-medium tracking-[-0.02em] text-departure">
              Gerelateerde reizen
            </h2>
            <Link
              href="/reizen"
              className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-departure hover:text-compass"
            >
              Alle reizen
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {relatedTrips.slice(0, 2).map((trip) => (
              <TripCard key={trip.slug} trip={trip} />
            ))}
            <div className="flex min-h-[300px] items-center justify-center border border-dashed border-line p-10 text-center">
              <p className="max-w-xs font-body text-sm font-light leading-relaxed text-muted">
                Meer reizen volgen
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
