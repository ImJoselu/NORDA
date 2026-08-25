import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subscriptionsApi } from './api'
import type { CreateSubscriptionRequest } from '@/types/subscription'

const KEY = ['subscriptions']

export function useSubscriptions() {
  return useQuery({ queryKey: KEY, queryFn: subscriptionsApi.list })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateSubscriptionRequest) => subscriptionsApi.create(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}

function useSubscriptionAction(action: (id: string) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => action(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}

export function usePauseSubscription() {
  return useSubscriptionAction(subscriptionsApi.pause)
}

export function useResumeSubscription() {
  return useSubscriptionAction(subscriptionsApi.resume)
}

export function useCancelSubscription() {
  return useSubscriptionAction(subscriptionsApi.cancel)
}

export function useSkipSubscription() {
  return useSubscriptionAction(subscriptionsApi.skip)
}
