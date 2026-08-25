import type { ProductDetail } from '@/types/catalog'
import type { ProductReviews } from '@/types/review'

export function productJsonLd(product: ProductDetail, reviews: ProductReviews | undefined, url: string) {
  const prices = product.variants.map((v) => v.priceCents / 100)
  const inStock = product.variants.some((v) => v.availability !== 'OUT_OF_STOCK')

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    url,
    brand: { '@type': 'Brand', name: 'NØRDA' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: product.variants.length,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(reviews && reviews.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviews.averageRating.toFixed(1),
            reviewCount: reviews.reviewCount,
          },
          review: reviews.reviews.slice(0, 10).map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.authorName },
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
            name: r.title,
            reviewBody: r.comment,
            datePublished: r.createdAt,
          })),
        }
      : {}),
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function articleJsonLd(params: {
  title: string
  description: string
  author: string
  publishedAt: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    author: { '@type': 'Person', name: params.author },
    publisher: { '@type': 'Organization', name: 'NØRDA' },
    datePublished: params.publishedAt,
    mainEntityOfPage: params.url,
  }
}
