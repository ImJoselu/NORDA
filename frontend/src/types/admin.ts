import type { BrewMethod, CoffeeProcess, Grind, RoastLevel } from './catalog'
import type { OrderStatus, ShippingAddress, ShippingMethod } from './order'

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
export type Continent = 'AMERICA' | 'AFRICA' | 'ASIA'
export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
export type CouponType = 'PERCENTAGE' | 'FIXED'
export type ReviewStatus = 'VISIBLE' | 'HIDDEN'

export interface DashboardResponse {
  totalRevenueCents: number
  totalOrders: number
  totalCustomers: number
  averageOrderValueCents: number
  lowStockCount: number
  activeSubscriptions: number
  recurringCustomers: number
  salesLast14Days: { date: string; revenueCents: number; orderCount: number }[]
  topProducts: { name: string; unitsSold: number; revenueCents: number }[]
  topCountries: { countryCode: string; orderCount: number }[]
}

export interface AdminCustomer {
  id: string
  name: string
  email: string
  orderCount: number
  totalSpentCents: number
  lastOrderAt: string | null
  hasActiveSubscription: boolean
  createdAt: string
}

export interface AdminInventoryItem {
  productVariantId: string
  productId: string
  productName: string
  sku: string
  weightGrams: number
  grind: Grind
  stock: number
  reserved: number
  available: number
  minStock: number
  status: InventoryStatus
}

export interface AdjustInventoryRequest {
  stock: number
  minStock: number
}

export interface AdminReview {
  id: string
  productId: string
  productName: string
  customerName: string
  rating: number
  title: string
  comment: string
  status: ReviewStatus
  createdAt: string
}

export interface AdminOrderSummary {
  id: string
  orderNumber: string
  status: OrderStatus
  customerName: string
  customerEmail: string
  totalCents: number
  itemCount: number
  createdAt: string
}

export interface AdminOrderDetail {
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
  items: {
    productVariantId: string
    productName: string
    weightGrams: number
    grind: Grind
    unitPriceCents: number
    quantity: number
    lineTotalCents: number
  }[]
  createdAt: string
}

export interface AdminCountry {
  id: string
  name: string
  slug: string
  continent: Continent
  description: string
  latitude: number
  longitude: number
  typicalAltitudeMinM: number
  typicalAltitudeMaxM: number
}

export interface AdminCountryRequest {
  name: string
  slug?: string
  continent?: Continent
  description: string
  latitude: number
  longitude: number
  typicalAltitudeMinM: number
  typicalAltitudeMaxM: number
}

export interface AdminRegion {
  id: string
  name: string
  slug: string
  countryId: string
  countryName: string
  description: string
  latitude: number
  longitude: number
}

export interface AdminRegionRequest {
  name: string
  slug?: string
  countryId?: string
  description: string
  latitude: number
  longitude: number
}

export interface AdminProducer {
  id: string
  name: string
  slug: string
  regionId: string
  regionName: string
  description: string
}

export interface AdminFarm {
  id: string
  name: string
  slug: string
  producerId: string
  producerName: string
  altitudeM: number
}

export interface AdminProductDetail {
  id: string
  sku: string
  slug: string
  name: string
  shortDescription: string
  longDescription: string
  countryId: string
  regionId: string
  producerId: string
  farmId: string
  variety: string
  process: CoffeeProcess
  altitudeM: number
  roastLevel: RoastLevel
  tastingNotes: string[]
  acidity: number
  body: number
  sweetness: number
  recommendedMethods: BrewMethod[]
  status: ProductStatus
  basePriceCents: number
}

export interface AdminProductRequest {
  sku?: string
  slug?: string
  name: string
  shortDescription: string
  longDescription: string
  countryId: string
  regionId: string
  producerId: string
  farmId: string
  variety: string
  process: CoffeeProcess
  altitudeM: number
  roastLevel: RoastLevel
  tastingNotes: string[]
  acidity: number
  body: number
  sweetness: number
  recommendedMethods: BrewMethod[]
  status: ProductStatus
  basePriceCents: number
}

export interface CouponResponse {
  id: string
  code: string
  type: CouponType
  value: number
  startsAt: string | null
  expiresAt: string | null
  minPurchaseCents: number | null
  maxUses: number | null
  usedCount: number
  active: boolean
}

export interface AdminCouponRequest {
  code: string
  type: CouponType
  value: number
  startsAt?: string | null
  expiresAt?: string | null
  minPurchaseCents?: number | null
  maxUses?: number | null
  active: boolean
}
