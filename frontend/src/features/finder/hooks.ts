import { useMutation } from '@tanstack/react-query'
import { finderApi } from './api'
import type { FinderRequest } from '@/types/finder'

export function useFinder() {
  return useMutation({
    mutationFn: (request: FinderRequest) => finderApi.submit(request),
  })
}
