import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartApi } from './api'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import type { CartResponse } from '@/types/cart'

const CART_KEY = ['cart']

export function useCart() {
  const status = useAuthStore((state) => state.status)
  return useQuery({
    queryKey: CART_KEY,
    queryFn: cartApi.get,
    enabled: status === 'authenticated',
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  const push = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: ({ productVariantId, quantity }: { productVariantId: string; quantity: number }) =>
      cartApi.addItem(productVariantId, quantity),
    onSuccess: (data: CartResponse) => {
      queryClient.setQueryData(CART_KEY, data)
      push('Añadido al carrito', 'success')
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => cartApi.updateItem(itemId, quantity),
    onSuccess: (data: CartResponse) => queryClient.setQueryData(CART_KEY, data),
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (data: CartResponse) => queryClient.setQueryData(CART_KEY, data),
  })
}
