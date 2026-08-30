import Image from 'next/image'
import Link from 'next/link'
import { ArrowIcon } from './icons'

export type TripCardData = {
  slug: string
  title: string
  summary?: string | null
  imageUrl?: string | null
  sportLabel?: string | null
  bestemmingLabel?: string | null
  duration?: string | null
  level?: string | null
  price: number
  priceUnit?: string | null
}

const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  gevorderd: 'Gevorderd',
  alle_niveaus: 'Alle niveaus',
}

export function TripCard({ trip }: { trip: TripCardData }) {
  return (
    <Link
      href={`/reizen/${trip.slug}`}
      className="group flex flex-col overflow-hidden border border-line bg-card"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-hatch">
        {trip.imageUrl ? (
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        {trip.level && (
          <span className="absolute left-4 top-4 bg-departure px-3 py-1 font-body text-[10px] font-medium uppercase tracking-[0.12em] text-canvas">
            {levelLabels[trip.level] ?? trip.level}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-accent-label">
          {trip.sportLabel && <span>{trip.sportLabel}</span>}
          {trip.sportLabel && trip.bestemmingLabel && <span>&middot;</span>}
          {trip.bestemmingLabel && <span>{trip.bestemmingLabel}</span>}
        </div>

        <h3 className="font-body text-xl font-medium leading-snug text-departure">{trip.title}</h3>

        {trip.summary && (
          <p className="font-body text-sm font-light leading-relaxed text-muted">{trip.summary}</p>
        )}

        {trip.duration && (
          <span className="font-body text-sm font-light text-muted">{trip.duration}</span>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <div className="flex flex-col">
            <span className="font-body text-lg font-medium leading-none text-departure">
              &euro;{trip.price}
            </span>
            <span className="font-body text-[11px] font-light text-muted">
              {trip.priceUnit ?? 'p.p.'}
            </span>
          </div>
          <span className="flex items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-departure">
            Bekijk reis
            <ArrowIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
