'use client'

import { useEffect, useState } from 'react'
import { Button } from './Button'

type StickySearchBarProps = {
  summary?: string
  ctaLabel?: string
  ctaHref?: string
}

export function StickySearchBar({
  summary = 'Alle sporten \u00b7 Turkije \u00b7 april tot oktober \u00b7 alle niveaus',
  ctaLabel = 'Zoek reizen',
  ctaHref = '/reizen',
}: StickySearchBarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`sticky top-0 z-40 flex items-center justify-between gap-8 border-b border-line bg-white px-6 py-3 transition-all duration-200 md:px-10 ${
        visible ? 'opacity-100' : '-translate-y-3 opacity-0 pointer-events-none'
      }`}
    >
      <span className="font-body text-[13px] font-medium text-departure">{summary}</span>
      <Button href={ctaHref} variant="dark" className="whitespace-nowrap">
        {ctaLabel}
      </Button>
    </div>
  )
}
