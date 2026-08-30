'use client'

import { useRef, useState } from 'react'
import { TripCard, type TripCardData } from './TripCard'
import { ArrowIcon } from './icons'

export function TripSlider({ trips }: { trips: TripCardData[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('[data-trip-card]')
    const amount = (card?.offsetWidth ?? 320) + 24
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setProgress(max > 0 ? track.scrollLeft / max : 0)
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {trips.map((trip) => (
          <div key={trip.slug} data-trip-card className="w-[300px] flex-none md:w-[360px]">
            <TripCard trip={trip} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-5">
        <div className="relative h-[2px] flex-1 bg-line">
          <div
            className="absolute top-0 h-[2px] w-[30%] bg-departure transition-[left] duration-150"
            style={{ left: `${progress * 70}%` }}
          />
        </div>
        <span className="whitespace-nowrap font-body text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          {trips.length} uitgelichte reizen
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Vorige"
            onClick={() => scrollByCard(-1)}
            className="flex h-11 w-11 items-center justify-center border border-departure text-departure transition-colors hover:bg-departure hover:text-canvas"
          >
            <ArrowIcon className="h-4 w-4 rotate-90" />
          </button>
          <button
            type="button"
            aria-label="Volgende"
            onClick={() => scrollByCard(1)}
            className="flex h-11 w-11 items-center justify-center bg-departure text-canvas transition-colors hover:bg-compass"
          >
            <ArrowIcon className="h-4 w-4 -rotate-90" />
          </button>
        </div>
      </div>
    </div>
  )
}
