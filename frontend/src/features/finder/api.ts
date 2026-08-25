import { httpClient } from '@/services/httpClient'
import type { FinderRequest, FinderResultItem } from '@/types/finder'

export const finderApi = {
  submit: (request: FinderRequest) => httpClient.post<FinderResultItem[]>('/recommendations/finder', request),
}
