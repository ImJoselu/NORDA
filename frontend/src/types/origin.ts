import type { ProductSummary } from './catalog'

export interface CountrySummary {
  name: string
  slug: string
  latitude: number
  longitude: number
  productCount: number
}

export interface ContinentGroup {
  continent: string
  countries: CountrySummary[]
}

export interface OriginStats {
  altitudeMinM: number
  altitudeMaxM: number
  commonProcesses: string[]
  avgAcidity: number
  avgBody: number
  avgSweetness: number
  topRegions: string[]
}

export interface RegionSummary {
  name: string
  slug: string
  latitude: number
  longitude: number
  producerCount: number
  productCount: number
}

export interface CountryDetail {
  name: string
  slug: string
  continent: string
  description: string
  latitude: number
  longitude: number
  stats: OriginStats
  regions: RegionSummary[]
  relatedProducts: ProductSummary[]
}

export interface FarmSummary {
  name: string
  slug: string
  altitudeM: number
}

export interface ProducerSummary {
  name: string
  slug: string
  description: string
  farms: FarmSummary[]
}

export interface RegionDetail {
  name: string
  slug: string
  description: string
  latitude: number
  longitude: number
  country: { name: string; slug: string }
  producers: ProducerSummary[]
  products: ProductSummary[]
}
