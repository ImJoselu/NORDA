import { describe, expect, it } from 'vitest'
import { articleJsonLd, breadcrumbJsonLd, productJsonLd } from './jsonLd'
import type { ProductDetail } from '@/types/catalog'
import type { ProductReviews } from '@/types/review'

const product: ProductDetail = {
  id: 'p1',
  sku: 'COL-HUI-001',
  name: 'Colombia Huila — Finca La Esperanza',
  slug: 'colombia-huila-finca-la-esperanza',
  shortDescription: 'Un lavado clásico de Huila.',
  longDescription: 'Descripción larga.',
  origin: {
    countryName: 'Colombia',
    countrySlug: 'colombia',
    regionName: 'Huila',
    regionSlug: 'huila',
    producerName: 'Finca La Esperanza',
    producerSlug: 'finca-la-esperanza',
    farmName: 'Finca La Esperanza',
    farmSlug: 'finca-la-esperanza',
  },
  variety: 'Castillo',
  process: 'WASHED',
  altitudeM: 1800,
  roastLevel: 'LIGHT',
  tastingNotes: ['caramelo', 'manzana roja'],
  acidity: 4,
  body: 3,
  sweetness: 4,
  recommendedMethods: ['V60'],
  lot: null,
  variants: [
    { id: 'v1', weightGrams: 250, grind: 'WHOLE_BEAN', priceCents: 1250, availability: 'IN_STOCK' },
    { id: 'v2', weightGrams: 500, grind: 'WHOLE_BEAN', priceCents: 2350, availability: 'OUT_OF_STOCK' },
  ],
}

describe('productJsonLd', () => {
  it('computes the low/high price range across all variants', () => {
    const result = productJsonLd(product, undefined, 'https://norda.example/coffee/x') as any

    expect(result['@type']).toBe('Product')
    expect(result.offers.lowPrice).toBe('12.50')
    expect(result.offers.highPrice).toBe('23.50')
    expect(result.offers.offerCount).toBe(2)
  })

  it('reports InStock when at least one variant is available', () => {
    const result = productJsonLd(product, undefined, 'https://norda.example/coffee/x') as any

    expect(result.offers.availability).toBe('https://schema.org/InStock')
  })

  it('reports OutOfStock only when every variant is unavailable', () => {
    const soldOut: ProductDetail = {
      ...product,
      variants: product.variants.map((v) => ({ ...v, availability: 'OUT_OF_STOCK' })),
    }
    const result = productJsonLd(soldOut, undefined, 'https://norda.example/coffee/x') as any

    expect(result.offers.availability).toBe('https://schema.org/OutOfStock')
  })

  it('omits aggregateRating and review when there are no reviews', () => {
    const noReviews: ProductReviews = { averageRating: 0, reviewCount: 0, reviews: [] }
    const result = productJsonLd(product, noReviews, 'https://norda.example/coffee/x') as any

    expect(result.aggregateRating).toBeUndefined()
    expect(result.review).toBeUndefined()
  })

  it('includes aggregateRating and review entries when reviews exist', () => {
    const reviews: ProductReviews = {
      averageRating: 4.5,
      reviewCount: 2,
      reviews: [
        { id: 'r1', authorName: 'Ana', rating: 5, title: 'Genial', comment: 'Muy bueno.', createdAt: '2026-01-01T00:00:00Z' },
        { id: 'r2', authorName: 'Luis', rating: 4, title: 'Bien', comment: 'Correcto.', createdAt: '2026-01-02T00:00:00Z' },
      ],
    }
    const result = productJsonLd(product, reviews, 'https://norda.example/coffee/x') as any

    expect(result.aggregateRating.ratingValue).toBe('4.5')
    expect(result.aggregateRating.reviewCount).toBe(2)
    expect(result.review).toHaveLength(2)
    expect(result.review[0].author.name).toBe('Ana')
  })
})

describe('breadcrumbJsonLd', () => {
  it('numbers items starting at position 1 in the given order', () => {
    const result = breadcrumbJsonLd([
      { name: 'Café', url: 'https://norda.example/coffee' },
      { name: 'Colombia', url: 'https://norda.example/origins/colombia' },
    ]) as any

    expect(result['@type']).toBe('BreadcrumbList')
    expect(result.itemListElement[0].position).toBe(1)
    expect(result.itemListElement[0].name).toBe('Café')
    expect(result.itemListElement[1].position).toBe(2)
  })
})

describe('articleJsonLd', () => {
  it('produces a well-formed Article entry', () => {
    const result = articleJsonLd({
      title: 'V60 paso a paso',
      description: 'Guía completa.',
      author: 'Marcos Iribarren',
      publishedAt: '2026-07-14T00:00:00Z',
      url: 'https://norda.example/journal/v60',
    }) as any

    expect(result['@type']).toBe('Article')
    expect(result.headline).toBe('V60 paso a paso')
    expect(result.author.name).toBe('Marcos Iribarren')
    expect(result.publisher.name).toBe('NØRDA')
  })
})
