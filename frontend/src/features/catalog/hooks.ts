import { useQuery } from '@tanstack/react-query'
import { catalogApi, type ProductFilters } from './api'

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => catalogApi.list(filters),
    placeholderData: (previous) => previous,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: catalogApi.featured,
  })
}

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: () => catalogApi.detail(slug),
    enabled: Boolean(slug),
  })
}
