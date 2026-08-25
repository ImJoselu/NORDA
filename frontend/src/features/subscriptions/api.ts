import { httpClient } from '@/services/httpClient'
import type { CreateSubscriptionRequest, Subscription } from '@/types/subscription'

export const subscriptionsApi = {
  list: () => httpClient.get<Subscription[]>('/subscriptions'),
  create: (request: CreateSubscriptionRequest) => httpClient.post<Subscription>('/subscriptions', request),
  pause: (id: string) => httpClient.post<Subscription>(`/subscriptions/${id}/pause`),
  resume: (id: string) => httpClient.post<Subscription>(`/subscriptions/${id}/resume`),
  cancel: (id: string) => httpClient.post<Subscription>(`/subscriptions/${id}/cancel`),
  skip: (id: string) => httpClient.post<Subscription>(`/subscriptions/${id}/skip`),
}
