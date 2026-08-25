import { useQuery } from '@tanstack/react-query'
import { journalApi } from './api'
import type { BlogCategory } from '@/types/blog'

export function useJournalPosts(category?: BlogCategory) {
  return useQuery({ queryKey: ['journal', category ?? 'ALL'], queryFn: () => journalApi.list(category) })
}

export function useJournalPost(slug: string) {
  return useQuery({
    queryKey: ['journal', 'post', slug],
    queryFn: () => journalApi.get(slug),
    enabled: Boolean(slug),
  })
}
