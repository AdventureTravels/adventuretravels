import Image from 'next/image'
import Link from 'next/link'

import type { Journal, Media } from '@/payload-types'

function resolveImageUrl(media: Journal['heroImage']): string | null {
  if (media && typeof media === 'object') {
    return (media as Media).url ?? null
  }
  return null
}

function formatDate(dateString?: string | null) {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function JournalCard({ entry }: { entry: Journal }) {
  const imageUrl = resolveImageUrl(entry.heroImage)
  const date = formatDate(entry.publishedDate)

  return (
    <Link href={`/journal/${entry.slug}`} className="group flex flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden media-placeholder">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={entry.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      {date && (
        <span className="font-body text-[11px] font-medium uppercase tracking-[0.12em] text-accent-label">
          {date}
        </span>
      )}
      <h3 className="font-body text-lg font-medium leading-snug text-departure">{entry.title}</h3>
      {entry.excerpt && (
        <p className="font-body text-sm font-light leading-relaxed text-muted">{entry.excerpt}</p>
      )}
    </Link>
  )
}
