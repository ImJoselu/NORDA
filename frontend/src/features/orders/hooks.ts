import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from './api'
import type { CheckoutRequest } from '@/types/order'

export function useCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CheckoutRequest) => ordersApi.checkout(request),
    onSuccess: () => {
      queryClient.setQueryData(['cart'], { items: [], itemCount: 0, subtotalCents: 0 })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: ordersApi.list })
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => ordersApi.get(orderId),
    enabled: Boolean(orderId),
  })
}
