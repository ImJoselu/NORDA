import { httpClient } from '@/services/httpClient'
import type { PageResponse, ProductDetail, ProductSummary } from '@/types/catalog'

export interface ProductFilters {
  country?: string
  region?: string
  producer?: string
  variety?: string
  process?: string
  roast?: string
  method?: string
  minAltitude?: number
  maxAltitude?: number
  minAcidity?: number
  maxAcidity?: number
  minBody?: number
  maxBody?: number
  minPriceCents?: number
  maxPriceCents?: number
  q?: string
  sort?: string
  page?: number
  size?: number
}

function toQueryString(filters: ProductFilters): string {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  })
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const catalogApi = {
  list: (filters: ProductFilters = {}) =>
    httpClient.get<PageResponse<ProductSummary>>(`/products${toQueryString(filters)}`),
  featured: () => httpClient.get<ProductSummary[]>('/products/featured'),
  detail: (slug: string) => httpClient.get<ProductDetail>(`/products/${slug}`),
}
