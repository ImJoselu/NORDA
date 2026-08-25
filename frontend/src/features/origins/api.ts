import { httpClient } from '@/services/httpClient'
import type { ContinentGroup, CountryDetail, RegionDetail } from '@/types/origin'

export const originApi = {
  tree: () => httpClient.get<ContinentGroup[]>('/origins'),
  country: (slug: string) => httpClient.get<CountryDetail>(`/origins/${slug}`),
  region: (countrySlug: string, regionSlug: string) =>
    httpClient.get<RegionDetail>(`/origins/${countrySlug}/${regionSlug}`),
}
