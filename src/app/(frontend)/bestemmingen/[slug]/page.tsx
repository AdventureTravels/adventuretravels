import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { BookingConditions } from '@/components/BookingConditions'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { TripCard } from '@/components/TripCard'
import { getBestemmingBySlug, getTrips } from '@/lib/data'
import type { Media, Sporten } from '@/payload-types'

import '../../styles.css'

type PageProps = { params: Promise<{ slug: string }> }

function resolveMediaUrl(media: unknown): string | null {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as Media).url ?? null
  }
  return null
}

function resolveSportNames(sports: (Sporten | number)[] | null | undefined): string {
  if (!sports) return ''
  return sports
    .map((sport) => (sport && typeof sport === 'object' && 'name' in sport ? sport.name : null))
    .filter((name): name is string => Boolean(name))
    .join(' · ')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const bestemming = await getBestemmingBySlug(slug)
  if (!bestemming) return {}
  return {
    title: `${bestemming.name} — AdventureTravels`,
    description: bestemming.description ?? undefined,
  }
}

export default async function BestemmingDetailPage({ params }: PageProps) {
  const { slug } = await params
  const bestemming = await getBestemmingBySlug(slug)

  if (!bestemming) {
    notFound()
  }

  const trips = await getTrips({ bestemmingSlug: slug })
  const heroUrl = resolveMediaUrl(bestemming.heroImage)
  const sportNames = resolveSportNames(bestemming.sports)

  return (
    <>
      <div className="relative h-[620px] w-full media-placeholder">
        {heroUrl && (
          <Image src={heroUrl} alt={bestemming.name} fill priority className="object-cover" />
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
            Bestemming
          </span>
          <h1 className="font-body text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-white md:text-[52px] md:leading-[1.08] md:tracking-[-0.03em]">
            {bestemming.name}
          </h1>
          {bestemming.description && (
            <p className="max-w-xl font-body text-base font-light leading-relaxed text-paper md:text-[17px]">
              {bestemming.description}
            </p>
          )}
          <div className="flex flex-wrap gap-6 pt-1 font-body text-[11px] font-medium uppercase tracking-[0.14em] text-white">
            {bestemming.flightTime && <span>Vliegtijd {bestemming.flightTime}</span>}
            {bestemming.bestPeriod && <span>{bestemming.bestPeriod}</span>}
            {sportNames && <span>{sportNames}</span>}
          </div>
        </div>
      </div>
      <div className="h-5 bg-compass" />

      <div className="grid grid-cols-1 gap-px border-b border-line bg-line md:grid-cols-2">
        {bestemming.whySpecial && (
          <div className="flex flex-col gap-4 bg-white px-8 py-14 md:px-14">
            <h2 className="font-body text-[28px] font-medium tracking-[-0.02em] text-departure">
              Wat dit bijzonder maakt
            </h2>
            <div className="max-w-xl font-body text-base font-light leading-relaxed text-muted [&_p]:mb-4">
              <RichText data={bestemming.whySpecial} />
            </div>
          </div>
        )}
        {(bestemming.flightTime || bestemming.bestPeriod || sportNames) && (
          <div className="flex flex-col gap-4 bg-white px-8 py-14 md:px-14">
            <h2 className="font-body text-[28px] font-medium tracking-[-0.02em] text-departure">
              Praktisch
            </h2>
            <p className="max-w-xl font-body text-base font-light leading-relaxed text-muted">
              {bestemming.flightTime && `Vliegtijd circa ${bestemming.flightTime}. `}
              {bestemming.bestPeriod && `Beste periode: ${bestemming.bestPeriod}. `}
              {sportNames && `Sport hier aangeboden: ${sportNames}.`}
            </p>
          </div>
        )}
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-7 px-6 py-16 md:px-10 md:py-20">
        <h2 className="font-body text-3xl font-medium tracking-[-0.02em] text-departure">
          Reizen naar {bestemming.name}
        </h2>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.slug} trip={trip} />
          ))}
          <div className="flex min-h-[300px] items-center justify-center border border-dashed border-line p-10 text-center">
            <p className="max-w-xs font-body text-sm font-light leading-relaxed text-muted">
              Meer reizen naar {bestemming.name} volgen
            </p>
          </div>
        </div>
      </div>

      <BookingConditions />

      <Footer />
    </>
  )
}
