export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED'
export type SubscriptionFrequency = 'TWO_WEEKS' | 'ONE_MONTH' | 'SIX_WEEKS' | 'TWO_MONTHS'
export type SubscriptionType = 'FIXED' | 'SURPRISE' | 'ORIGIN_DISCOVERY'

export interface SubscriptionItem {
  productId: string
  productName: string
  productSlug: string | null
}

export interface Subscription {
  id: string
  status: SubscriptionStatus
  coffeeCount: number
  frequency: SubscriptionFrequency
  type: SubscriptionType
  originCountryName: string | null
  nextDeliveryDate: string
  items: SubscriptionItem[]
}

export interface CreateSubscriptionRequest {
  coffeeCount: number
  frequency: SubscriptionFrequency
  type: SubscriptionType
  fixedProductIds?: string[]
  originCountrySlug?: string
}
