import { httpClient } from '@/services/httpClient'
import type {
  AdjustInventoryRequest,
  AdminCouponRequest,
  AdminCountry,
  AdminCountryRequest,
  AdminCustomer,
  AdminFarm,
  AdminInventoryItem,
  AdminOrderDetail,
  AdminOrderSummary,
  AdminProducer,
  AdminProductDetail,
  AdminProductRequest,
  AdminRegion,
  AdminRegionRequest,
  AdminReview,
  CouponResponse,
  DashboardResponse,
} from '@/types/admin'
import type { OrderStatus } from '@/types/order'
import type { ProductSummary } from '@/types/catalog'

export const adminDashboardApi = {
  get: () => httpClient.get<DashboardResponse>('/admin/dashboard'),
}

export const adminCustomersApi = {
  list: () => httpClient.get<AdminCustomer[]>('/admin/customers'),
}

export const adminInventoryApi = {
  list: (lowStockOnly: boolean) =>
    httpClient.get<AdminInventoryItem[]>(`/admin/inventory?lowStockOnly=${lowStockOnly}`),
  adjust: (variantId: string, request: AdjustInventoryRequest) =>
    httpClient.put<AdminInventoryItem>(`/admin/inventory/${variantId}`, request),
}

export const adminReviewsApi = {
  list: () => httpClient.get<AdminReview[]>('/admin/reviews'),
  hide: (id: string) => httpClient.post<void>(`/admin/reviews/${id}/hide`),
  restore: (id: string) => httpClient.post<void>(`/admin/reviews/${id}/restore`),
}

export const adminOrdersApi = {
  list: (status?: OrderStatus) =>
    httpClient.get<AdminOrderSummary[]>(`/admin/orders${status ? `?status=${status}` : ''}`),
  get: (id: string) => httpClient.get<AdminOrderDetail>(`/admin/orders/${id}`),
  updateStatus: (id: string, status: OrderStatus) =>
    httpClient.patch<AdminOrderDetail>(`/admin/orders/${id}/status`, { status }),
}

export const adminProductsApi = {
  list: () => httpClient.get<ProductSummary[]>('/admin/products'),
  get: (id: string) => httpClient.get<AdminProductDetail>(`/admin/products/${id}`),
  create: (request: AdminProductRequest) => httpClient.post<ProductSummary>('/admin/products', request),
  update: (id: string, request: AdminProductRequest) =>
    httpClient.put<ProductSummary>(`/admin/products/${id}`, request),
  archive: (id: string) => httpClient.post<ProductSummary>(`/admin/products/${id}/archive`),
  activate: (id: string) => httpClient.post<ProductSummary>(`/admin/products/${id}/activate`),
}

export const adminOriginsApi = {
  listCountries: () => httpClient.get<AdminCountry[]>('/admin/countries'),
  createCountry: (request: AdminCountryRequest) => httpClient.post<AdminCountry>('/admin/countries', request),
  updateCountry: (id: string, request: AdminCountryRequest) =>
    httpClient.put<AdminCountry>(`/admin/countries/${id}`, request),
  listRegions: (countryId?: string) =>
    httpClient.get<AdminRegion[]>(`/admin/regions${countryId ? `?countryId=${countryId}` : ''}`),
  createRegion: (request: AdminRegionRequest) => httpClient.post<AdminRegion>('/admin/regions', request),
  updateRegion: (id: string, request: AdminRegionRequest) =>
    httpClient.put<AdminRegion>(`/admin/regions/${id}`, request),
  listProducers: (regionId?: string) =>
    httpClient.get<AdminProducer[]>(`/admin/producers${regionId ? `?regionId=${regionId}` : ''}`),
  listFarms: (producerId?: string) =>
    httpClient.get<AdminFarm[]>(`/admin/farms${producerId ? `?producerId=${producerId}` : ''}`),
}

export const adminCouponsApi = {
  list: () => httpClient.get<CouponResponse[]>('/admin/coupons'),
  create: (request: AdminCouponRequest) => httpClient.post<CouponResponse>('/admin/coupons', request),
  update: (id: string, request: AdminCouponRequest) =>
    httpClient.put<CouponResponse>(`/admin/coupons/${id}`, request),
  delete: (id: string) => httpClient.delete<void>(`/admin/coupons/${id}`),
}
