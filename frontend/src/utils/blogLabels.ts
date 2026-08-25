import type { BlogCategory } from '@/types/blog'

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  GUIDES: 'Guías',
  ORIGINS: 'Orígenes',
  METHODS: 'Métodos',
  PRODUCERS: 'Productores',
  RECIPES: 'Recetas',
}

export function formatJournalDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}
