import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/services/httpClient'
import { Button } from '@/components/ui/Button'
import { useCartDrawerStore } from '@/store/cartDrawerStore'
import { useToastStore } from '@/store/toastStore'
import type { CartResponse } from '@/types/cart'

export function ReorderButton({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient()
  const openCart = useCartDrawerStore((state) => state.open)
  const push = useToastStore((state) => state.push)

  const reorder = useMutation({
    mutationFn: () => httpClient.post<CartResponse>(`/orders/${orderId}/reorder`),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data)
      push('Hemos añadido los artículos a tu carrito', 'success')
      openCart()
    },
  })

  return (
    <Button variant="secondary" onClick={() => reorder.mutate()} disabled={reorder.isPending}>
      {reorder.isPending ? 'Añadiendo…' : 'Volver a pedir'}
    </Button>
  )
}
