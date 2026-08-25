import { useQuery } from '@tanstack/react-query'
import { originApi } from './api'

export function useOriginTree() {
  return useQuery({ queryKey: ['origins', 'tree'], queryFn: originApi.tree })
}

export function useCountryDetail(slug: string) {
  return useQuery({
    queryKey: ['origins', 'country', slug],
    queryFn: () => originApi.country(slug),
    enabled: Boolean(slug),
  })
}

export function useRegionDetail(countrySlug: string, regionSlug: string) {
  return useQuery({
    queryKey: ['origins', 'region', countrySlug, regionSlug],
    queryFn: () => originApi.region(countrySlug, regionSlug),
    enabled: Boolean(countrySlug) && Boolean(regionSlug),
  })
}
