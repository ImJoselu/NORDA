import { httpClient } from '@/services/httpClient'
import type { CreateReviewRequest, ProductReviews, Review } from '@/types/review'

export const reviewsApi = {
  list: (slug: string) => httpClient.get<ProductReviews>(`/products/${slug}/reviews`),
  create: (slug: string, request: CreateReviewRequest) =>
    httpClient.post<Review>(`/products/${slug}/reviews`, request),
}
