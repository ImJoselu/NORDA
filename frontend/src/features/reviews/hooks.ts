import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from './api'
import type { CreateReviewRequest } from '@/types/review'

export function useProductReviews(slug: string) {
  return useQuery({
    queryKey: ['reviews', slug],
    queryFn: () => reviewsApi.list(slug),
    enabled: Boolean(slug),
  })
}

export function useCreateReview(slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateReviewRequest) => reviewsApi.create(slug, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews', slug] }),
  })
}
