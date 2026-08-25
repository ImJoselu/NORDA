import type { Availability, Grind } from './catalog'

export interface CartItem {
  id: string
  productVariantId: string
  productName: string
  productSlug: string
  weightGrams: number
  grind: Grind
  unitPriceCents: number
  quantity: number
  lineTotalCents: number
  availability: Availability
}

export interface CartResponse {
  items: CartItem[]
  itemCount: number
  subtotalCents: number
}
