import type { Where } from 'payload'

import type { TripCardData } from '@/components/TripCard'
import type { Bestemmingen, Journal, Media, Reizen, Sporten } from '@/payload-types'

import { getPayloadClient } from './payload'

function resolveMediaUrl(media: Reizen['heroImage']): string | null {
  if (media && typeof media === 'object') {
    return (media as Media).url ?? null
  }
  return null
}

function resolveName(rel: Sporten | Bestemmingen | number): string | null {
  if (rel && typeof rel === 'object' && 'name' in rel) {
    return rel.name
  }
  return null
}

function toTripCard(trip: Reizen): TripCardData {
  return {
    slug: trip.slug,
    title: trip.title,
    summary: trip.summary,
    imageUrl: resolveMediaUrl(trip.heroImage),
    sportLabel: resolveName(trip.sport),
    bestemmingLabel: resolveName(trip.bestemming),
    duration: trip.duration,
    level: trip.level,
    price: trip.price,
    priceUnit: trip.priceUnit,
  }
}

export async function getFeaturedTrips(limit = 4): Promise<TripCardData[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'reizen',
    where: { status: { equals: 'published' } },
    limit,
    depth: 1,
    sort: '-createdAt',
  })
  return result.docs.map(toTripCard)
}

type TripFilters = {
  sportSlug?: string
  bestemmingSlug?: string
  level?: string
}

export async function getTrips(filters: TripFilters = {}): Promise<TripCardData[]> {
  const payload = await getPayloadClient()

  const where: Where = { status: { equals: 'published' } }

  if (filters.sportSlug) {
    const sport = await payload.find({
      collection: 'sporten',
      where: { slug: { equals: filters.sportSlug } },
      limit: 1,
    })
    if (sport.docs[0]) {
      where.sport = { equals: sport.docs[0].id }
    }
  }

  if (filters.bestemmingSlug) {
    const bestemming = await payload.find({
      collection: 'bestemmingen',
      where: { slug: { equals: filters.bestemmingSlug } },
      limit: 1,
    })
    if (bestemming.docs[0]) {
      where.bestemming = { equals: bestemming.docs[0].id }
    }
  }

  if (filters.level) {
    where.level = { equals: filters.level }
  }

  const result = await payload.find({
    collection: 'reizen',
    where,
    depth: 1,
    sort: '-createdAt',
    limit: 100,
  })

  return result.docs.map(toTripCard)
}

export async function getTripBySlug(slug: string): Promise<Reizen | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'reizen',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function getAllSporten(): Promise<Sporten[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'sporten', limit: 100, depth: 1 })
  return result.docs
}

export async function getSportBySlug(slug: string): Promise<Sporten | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'sporten',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function getAllBestemmingen(): Promise<Bestemmingen[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'bestemmingen', limit: 100, depth: 1 })
  return result.docs
}

export async function getBestemmingBySlug(slug: string): Promise<Bestemmingen | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'bestemmingen',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return result.docs[0] ?? null
}

export function resolveCategoryLabel(category: Journal['category']): string | null {
  if (category && typeof category === 'object' && 'value' in category) {
    const value = category.value
    if (value && typeof value === 'object' && 'name' in value) {
      return value.name
    }
  }
  return null
}

export async function getJournalEntries(limit = 100): Promise<Journal[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'journal',
    limit,
    depth: 1,
    sort: '-publishedDate',
  })
  return result.docs
}

export async function getJournalBySlug(slug: string): Promise<Journal | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'journal',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
}
