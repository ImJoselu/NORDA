import { httpClient } from '@/services/httpClient'
import type { ProductSummary } from '@/types/catalog'

export const favoritesApi = {
  list: () => httpClient.get<ProductSummary[]>('/favorites'),
  add: (productId: string) => httpClient.post<void>(`/favorites/${productId}`),
  remove: (productId: string) => httpClient.delete<void>(`/favorites/${productId}`),
}
