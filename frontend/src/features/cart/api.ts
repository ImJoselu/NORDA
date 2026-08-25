import { httpClient } from '@/services/httpClient'
import type { CartResponse } from '@/types/cart'

export const cartApi = {
  get: () => httpClient.get<CartResponse>('/cart'),
  addItem: (productVariantId: string, quantity: number) =>
    httpClient.post<CartResponse>('/cart/items', { productVariantId, quantity }),
  updateItem: (itemId: string, quantity: number) =>
    httpClient.patch<CartResponse>(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => httpClient.delete<CartResponse>(`/cart/items/${itemId}`),
}
