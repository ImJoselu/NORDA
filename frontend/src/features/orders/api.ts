import { httpClient } from '@/services/httpClient'
import type { CheckoutRequest, Order, OrderSummary } from '@/types/order'

export const ordersApi = {
  checkout: (request: CheckoutRequest) => httpClient.post<Order>('/checkout', request),
  list: () => httpClient.get<OrderSummary[]>('/orders'),
  get: (orderId: string) => httpClient.get<Order>(`/orders/${orderId}`),
}
