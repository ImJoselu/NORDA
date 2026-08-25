import type { OrderStatus, ShippingMethod } from '@/types/order'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  PROCESSING: 'En preparación',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
}

export const ORDER_STATUS_TONE: Record<OrderStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  PENDING: 'warning',
  PAID: 'success',
  PROCESSING: 'neutral',
  SHIPPED: 'neutral',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  REFUNDED: 'danger',
}

export const SHIPPING_METHOD_LABELS: Record<ShippingMethod, string> = {
  STANDARD: 'Estándar',
  EXPRESS: 'Express',
  PICKUP: 'Recogida en tienda',
}
