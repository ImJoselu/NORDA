import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '@/store/toastStore'
import type {
  AdjustInventoryRequest,
  AdminCouponRequest,
  AdminCountryRequest,
  AdminProductRequest,
  AdminRegionRequest,
} from '@/types/admin'
import type { OrderStatus } from '@/types/order'
import { ApiError } from '@/services/httpClient'
import {
  adminCouponsApi,
  adminCustomersApi,
  adminDashboardApi,
  adminInventoryApi,
  adminOrdersApi,
  adminOriginsApi,
  adminProductsApi,
  adminReviewsApi,
} from './api'

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

export function useAdminDashboard() {
  return useQuery({ queryKey: ['admin', 'dashboard'], queryFn: adminDashboardApi.get })
}

export function useAdminCustomers() {
  return useQuery({ queryKey: ['admin', 'customers'], queryFn: adminCustomersApi.list })
}

export function useAdminInventory(lowStockOnly: boolean) {
  return useQuery({
    queryKey: ['admin', 'inventory', lowStockOnly],
    queryFn: () => adminInventoryApi.list(lowStockOnly),
  })
}

export function useAdjustInventory() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: ({ variantId, request }: { variantId: string; request: AdjustInventoryRequest }) =>
      adminInventoryApi.adjust(variantId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] })
      pushToast('Inventario actualizado.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo actualizar el inventario.'), 'error'),
  })
}

export function useAdminReviews() {
  return useQuery({ queryKey: ['admin', 'reviews'], queryFn: adminReviewsApi.list })
}

export function useHideReview() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: (id: string) => adminReviewsApi.hide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
      pushToast('Reseña ocultada.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo ocultar la reseña.'), 'error'),
  })
}

export function useRestoreReview() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: (id: string) => adminReviewsApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
      pushToast('Reseña restaurada.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo restaurar la reseña.'), 'error'),
  })
}

export function useAdminOrders(status?: OrderStatus) {
  return useQuery({ queryKey: ['admin', 'orders', status ?? 'ALL'], queryFn: () => adminOrdersApi.list(status) })
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: ['admin', 'orders', 'detail', id],
    queryFn: () => adminOrdersApi.get(id),
    enabled: Boolean(id),
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => adminOrdersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
      pushToast('Estado del pedido actualizado.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo cambiar el estado del pedido.'), 'error'),
  })
}

export function useAdminProducts() {
  return useQuery({ queryKey: ['admin', 'products'], queryFn: adminProductsApi.list })
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ['admin', 'products', 'detail', id],
    queryFn: () => adminProductsApi.get(id),
    enabled: Boolean(id),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: (request: AdminProductRequest) => adminProductsApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      pushToast('Café creado.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo crear el café.'), 'error'),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: AdminProductRequest }) => adminProductsApi.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      pushToast('Café actualizado.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo actualizar el café.'), 'error'),
  })
}

export function useArchiveProduct() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: (id: string) => adminProductsApi.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      pushToast('Café archivado.', 'success')
    },
  })
}

export function useActivateProduct() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: (id: string) => adminProductsApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      pushToast('Café activado.', 'success')
    },
  })
}

export function useAdminCountries() {
  return useQuery({ queryKey: ['admin', 'countries'], queryFn: adminOriginsApi.listCountries })
}

export function useAdminRegions(countryId?: string) {
  return useQuery({
    queryKey: ['admin', 'regions', countryId ?? 'ALL'],
    queryFn: () => adminOriginsApi.listRegions(countryId),
  })
}

export function useAdminProducers(regionId?: string) {
  return useQuery({
    queryKey: ['admin', 'producers', regionId ?? 'ALL'],
    queryFn: () => adminOriginsApi.listProducers(regionId),
    enabled: Boolean(regionId),
  })
}

export function useAdminFarms(producerId?: string) {
  return useQuery({
    queryKey: ['admin', 'farms', producerId ?? 'ALL'],
    queryFn: () => adminOriginsApi.listFarms(producerId),
    enabled: Boolean(producerId),
  })
}

export function useCreateCountry() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: (request: AdminCountryRequest) => adminOriginsApi.createCountry(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'countries'] })
      pushToast('País creado.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo crear el país.'), 'error'),
  })
}

export function useUpdateCountry() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: AdminCountryRequest }) =>
      adminOriginsApi.updateCountry(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'countries'] })
      pushToast('País actualizado.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo actualizar el país.'), 'error'),
  })
}

export function useCreateRegion() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: (request: AdminRegionRequest) => adminOriginsApi.createRegion(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'regions'] })
      pushToast('Región creada.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo crear la región.'), 'error'),
  })
}

export function useUpdateRegion() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: AdminRegionRequest }) =>
      adminOriginsApi.updateRegion(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'regions'] })
      pushToast('Región actualizada.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo actualizar la región.'), 'error'),
  })
}

export function useAdminCoupons() {
  return useQuery({ queryKey: ['admin', 'coupons'], queryFn: adminCouponsApi.list })
}

export function useCreateCoupon() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: (request: AdminCouponRequest) => adminCouponsApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      pushToast('Cupón creado.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo crear el cupón.'), 'error'),
  })
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: AdminCouponRequest }) => adminCouponsApi.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      pushToast('Cupón actualizado.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo actualizar el cupón.'), 'error'),
  })
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((state) => state.push)
  return useMutation({
    mutationFn: (id: string) => adminCouponsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      pushToast('Cupón eliminado.', 'success')
    },
    onError: (error) => pushToast(errorMessage(error, 'No se pudo eliminar el cupón.'), 'error'),
  })
}
