import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { BookingConditions } from '@/components/BookingConditions'
import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { getTripBySlug } from '@/lib/data'
import type { Bestemmingen, Media, Sporten } from '@/payload-types'

import '../../styles.css'

type PageProps = { params: Promise<{ slug: string }> }

const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  gevorderd: 'Gevorderd',
  alle_niveaus: 'Beginner tot gevorderd',
}

function resolveMediaUrl(media: unknown): string | null {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as Media).url ?? null
  }
  return null
}

function resolveLabel(rel: Sporten | Bestemmingen | number): string {
  if (rel && typeof rel === 'object' && 'name' in rel) {
    return rel.name
  }
  return ''
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const trip = await getTripBySlug(slug)
  if (!trip) return {}
  return {
    title: `${trip.title} — AdventureTravels`,
    description: trip.summary ?? undefined,
  }
}

export default async function ReisDetailPage({ params }: PageProps) {
  const { slug } = await params
  const trip = await getTripBySlug(slug)

  if (!trip) {
    notFound()
  }

  const heroUrl = resolveMediaUrl(trip.heroImage)
  const sportLabel = resolveLabel(trip.sport)
  const bestemmingLabel = resolveLabel(trip.bestemming)

  return (
    <>
      <div className="relative h-[620px] w-full media-placeholder">
        {heroUrl && (
          <Image src={heroUrl} alt={trip.title} fill priority className="object-cover" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(20,23,15,0.55) 0%, rgba(20,23,15,0.12) 30%, rgba(20,23,15,0.10) 46%, rgba(20,23,15,0.70) 100%)',
          }}
        />
        <Nav variant="transparent" />

        <div className="absolute bottom-14 left-6 z-10 flex max-w-3xl flex-col gap-4 md:left-12">
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-canvas">
            {bestemmingLabel} &middot; {sportLabel}
          </span>
          <h1 className="font-body text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-white md:text-[58px] md:leading-[1.06] md:tracking-[-0.03em]">
            {trip.title}
          </h1>
          {trip.summary && (
            <p className="max-w-xl font-body text-base font-light leading-relaxed text-paper md:text-[17px]">
              {trip.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-6 pt-1 font-body text-[11px] font-medium uppercase tracking-[0.14em] text-white">
            {trip.duration && <span>{trip.duration}</span>}
            {trip.level && <span>{levelLabels[trip.level] ?? trip.level}</span>}
          </div>
        </div>
      </div>
      <div className="h-5 bg-compass" />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 py-16 md:grid-cols-[1fr_420px] md:px-10 md:py-20">
        <div className="flex flex-col gap-14 min-w-0">
          {trip.program && trip.program.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="font-body text-3xl font-medium tracking-[-0.02em] text-departure">
                Programma
              </h2>
              <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
                {trip.program.map((day) => (
                  <div key={day.id ?? day.dag} className="flex flex-col gap-3 bg-white px-6 py-6">
                    <span className="font-display text-xs text-compass">DAG {day.dag}</span>
                    <span className="font-body text-base font-medium text-departure">
                      {day.titel}
                    </span>
                    {day.beschrijving && (
                      <p className="font-body text-sm font-light leading-relaxed text-muted">
                        {day.beschrijving}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {trip.accommodationDescription && (
            <div className="flex flex-col gap-4">
              <h2 className="font-body text-3xl font-medium tracking-[-0.02em] text-departure">
                Het verblijf
              </h2>
              <div className="max-w-2xl font-body text-base font-light leading-relaxed text-muted [&_p]:mb-4">
                <RichText data={trip.accommodationDescription} />
              </div>
              <a
                href="/verblijf"
                className="inline-flex w-fit items-center gap-3 border border-departure px-6 py-3 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-departure"
              >
                Verblijf-concept
              </a>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-5 md:sticky md:top-8">
          <div className="flex flex-col gap-6 bg-white p-8 shadow-lg">
            <div>
              <div className="font-display text-2xl leading-none text-departure">
                &euro;{trip.price}{' '}
                <span className="font-body text-sm font-light text-muted">
                  {trip.priceUnit ?? 'p.p.'}
                </span>
              </div>
            </div>

            {trip.included && trip.included.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-line pt-5">
                <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                  Inbegrepen
                </span>
                <p className="font-body text-sm font-light leading-relaxed text-departure">
                  {trip.included.map((entry) => entry.item).join(' \u00b7 ')}
                </p>
              </div>
            )}

            {trip.excluded && trip.excluded.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-line pt-5">
                <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                  Niet inbegrepen
                </span>
                <p className="font-body text-sm font-light leading-relaxed text-muted">
                  {trip.excluded.map((entry) => entry.item).join(' \u00b7 ')}
                </p>
              </div>
            )}

            {trip.level && (
              <div className="flex flex-col gap-2 border-t border-line pt-5">
                <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                  Niveau
                </span>
                <p className="font-body text-sm font-light leading-relaxed text-departure">
                  {levelLabels[trip.level] ?? trip.level}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button href="/contact" variant="primary">
                Boek deze reis
              </Button>
              <Button href="/contact" variant="outline">
                Vraag beschikbaarheid
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-departure px-7 py-6 text-canvas">
            <div>
              <div className="font-body text-sm font-medium">Twijfel over je niveau?</div>
              <div className="mt-1 font-body text-[13px] font-light text-dune">
                Spreek een gids &middot; +31 20 244 18 60
              </div>
            </div>
          </div>
        </aside>
      </div>

      <BookingConditions />

      <Footer />
    </>
  )
}
