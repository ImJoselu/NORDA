export type CoffeeProcess = 'WASHED' | 'NATURAL' | 'HONEY' | 'ANAEROBIC'
export type RoastLevel = 'LIGHT' | 'MEDIUM' | 'MEDIUM_DARK' | 'DARK'
export type BrewMethod = 'ESPRESSO' | 'V60' | 'MOKA' | 'FRENCH_PRESS' | 'AEROPRESS'
export type Grind = 'WHOLE_BEAN' | BrewMethod
export type Availability = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

export interface ProductSummary {
  id: string
  sku: string
  name: string
  slug: string
  shortDescription: string
  countryName: string
  countrySlug: string
  regionName: string
  regionSlug: string
  roastLevel: RoastLevel
  process: CoffeeProcess
  tastingNotes: string[]
  acidity: number
  body: number
  sweetness: number
  priceFromCents: number
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
}

export interface ProductVariant {
  id: string
  weightGrams: number
  grind: Grind
  priceCents: number
  availability: Availability
}

export interface OriginRef {
  countryName: string
  countrySlug: string
  regionName: string
  regionSlug: string
  producerName: string
  producerSlug: string
  farmName: string
  farmSlug: string
}

export interface LotSummary {
  code: string
  harvestDate: string
  roastDate: string
}

export interface ProductDetail {
  id: string
  sku: string
  name: string
  slug: string
  shortDescription: string
  longDescription: string
  origin: OriginRef
  variety: string
  process: CoffeeProcess
  altitudeM: number
  roastLevel: RoastLevel
  tastingNotes: string[]
  acidity: number
  body: number
  sweetness: number
  recommendedMethods: BrewMethod[]
  lot: LotSummary | null
  variants: ProductVariant[]
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
