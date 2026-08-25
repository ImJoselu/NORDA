import { httpClient } from '@/services/httpClient'
import type { BlogCategory, BlogPostDetail, BlogPostSummary } from '@/types/blog'

export const journalApi = {
  list: (category?: BlogCategory) =>
    httpClient.get<BlogPostSummary[]>(`/journal${category ? `?category=${category}` : ''}`),
  get: (slug: string) => httpClient.get<BlogPostDetail>(`/journal/${slug}`),
}
