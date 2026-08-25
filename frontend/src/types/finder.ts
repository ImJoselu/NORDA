import type { BrewMethod, ProductSummary } from './catalog'

export type FlavorProfile = 'SWEET' | 'FRUITY' | 'CHOCOLATE' | 'FLORAL' | 'CITRUS' | 'INTENSE'
export type BodyPreference = 'LIGHT' | 'MEDIUM' | 'INTENSE'
export type AcidityPreference = 'LOW' | 'MEDIUM' | 'HIGH'
export type BudgetRange = 'UNDER_15' | 'FROM_15_TO_20' | 'FROM_20_TO_30' | 'OVER_30'

export interface FinderRequest {
  method: BrewMethod
  profiles: FlavorProfile[]
  body: BodyPreference
  acidity: AcidityPreference
  budget: BudgetRange
}

export interface FinderResultItem {
  product: ProductSummary
  matchPercent: number
  explanation: string
}
