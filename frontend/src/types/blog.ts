export type BlogCategory = 'GUIDES' | 'ORIGINS' | 'METHODS' | 'PRODUCERS' | 'RECIPES'

export interface BlogPostSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  author: string
  publishedAt: string
  readingTimeMinutes: number
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string
}
