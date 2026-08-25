import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { favoritesApi } from './api'
import { useAuthStore } from '@/store/authStore'

const FAVORITES_KEY = ['favorites']

export function useFavorites() {
  const status = useAuthStore((state) => state.status)
  return useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: favoritesApi.list,
    enabled: status === 'authenticated',
  })
}

export function useIsFavorite(productId: string) {
  const { data } = useFavorites()
  return data?.some((product) => product.id === productId) ?? false
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  const favorites = useFavorites()

  return useMutation({
    mutationFn: async (productId: string) => {
      const isFavorite = favorites.data?.some((product) => product.id === productId) ?? false
      if (isFavorite) {
        await favoritesApi.remove(productId)
      } else {
        await favoritesApi.add(productId)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAVORITES_KEY }),
  })
}
