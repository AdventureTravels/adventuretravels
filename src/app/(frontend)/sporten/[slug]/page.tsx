import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { BookingConditions } from '@/components/BookingConditions'
import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { TripCard } from '@/components/TripCard'
import { getSportBySlug, getTrips } from '@/lib/data'
import type { Media } from '@/payload-types'

import '../../styles.css'

type PageProps = { params: Promise<{ slug: string }> }

function resolveMediaUrl(media: unknown): string | null {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as Media).url ?? null
  }
  return null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const sport = await getSportBySlug(slug)
  if (!sport) return {}
  return {
    title: `${sport.name} — AdventureTravels`,
    description: sport.description ?? undefined,
  }
}

export default async function SportDetailPage({ params }: PageProps) {
  const { slug } = await params
  const sport = await getSportBySlug(slug)

  if (!sport) {
    notFound()
  }

  const trips = await getTrips({ sportSlug: slug })
  const heroUrl = resolveMediaUrl(sport.heroImage)

  return (
    <>
      <div className="relative h-[620px] w-full media-placeholder">
        {heroUrl && (
          <Image src={heroUrl} alt={sport.name} fill priority className="object-cover" />
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
            Sport
          </span>
          <h1 className="font-body text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-white md:text-[52px] md:leading-[1.08] md:tracking-[-0.03em]">
            {sport.name}
          </h1>
          {sport.description && (
            <p className="max-w-xl font-body text-base font-light leading-relaxed text-paper md:text-[17px]">
              {sport.description}
            </p>
          )}
        </div>
      </div>
      <div className="h-5 bg-compass" />

      <div className="grid grid-cols-1 gap-px border-b border-line bg-line md:grid-cols-2">
        {sport.forWho && (
          <div className="flex flex-col gap-4 bg-white px-8 py-14 md:px-14">
            <h2 className="font-body text-[28px] font-medium tracking-[-0.02em] text-departure">
              Voor wie
            </h2>
            <div className="max-w-xl font-body text-base font-light leading-relaxed text-muted [&_p]:mb-4">
              <RichText data={sport.forWho} />
            </div>
          </div>
        )}
        {sport.whatToExpect && (
          <div className="flex flex-col gap-4 bg-white px-8 py-14 md:px-14">
            <h2 className="font-body text-[28px] font-medium tracking-[-0.02em] text-departure">
              Wat je kunt verwachten
            </h2>
            <div className="max-w-xl font-body text-base font-light leading-relaxed text-muted [&_p]:mb-4">
              <RichText data={sport.whatToExpect} />
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-7 px-6 py-16 md:px-10 md:py-20">
        <h2 className="font-body text-3xl font-medium tracking-[-0.02em] text-departure">
          Reizen met {sport.name}
        </h2>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {trips.map((trip) => (
            <TripCard key={trip.slug} trip={trip} />
          ))}
          <div className="flex min-h-[300px] items-center justify-center border border-dashed border-line p-10 text-center">
            <p className="max-w-xs font-body text-sm font-light leading-relaxed text-muted">
              Meer reizen volgen
            </p>
          </div>
        </div>
        <div className="pt-1">
          <Button href={`/reizen?sport=${sport.slug}`} variant="primary">
            Bekijk reizen met {sport.name}
          </Button>
        </div>
      </div>

      <BookingConditions />

      <Footer />
    </>
  )
}
