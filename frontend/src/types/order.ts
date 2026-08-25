import type { Grind } from './catalog'

export type ShippingMethod = 'STANDARD' | 'EXPRESS' | 'PICKUP'
export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'

export interface ShippingAddress {
  fullName: string
  line1: string
  line2?: string
  city: string
  region: string
  postalCode: string
  country: string
  phone: string
}

export interface CheckoutRequest {
  shippingAddress: ShippingAddress
  shippingMethod: ShippingMethod
}

export interface OrderItem {
  productVariantId: string
  productName: string
  weightGrams: number
  grind: Grind
  unitPriceCents: number
  quantity: number
  lineTotalCents: number
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  shippingAddress: ShippingAddress
  shippingMethod: ShippingMethod
  subtotalCents: number
  shippingCents: number
  discountCents: number
  taxCents: number
  totalCents: number
  items: OrderItem[]
  createdAt: string
}

export interface OrderSummary {
  id: string
  orderNumber: string
  status: OrderStatus
  totalCents: number
  itemCount: number
  createdAt: string
}
