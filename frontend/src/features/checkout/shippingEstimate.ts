import type { ShippingMethod } from '@/types/order'

const STANDARD_CENTS = 350
const EXPRESS_CENTS = 890
const FREE_STANDARD_THRESHOLD_CENTS = 3500

/** Estimación solo para mostrar en el wizard: el backend recalcula el importe real al confirmar. */
export function estimateShippingCents(method: ShippingMethod, subtotalCents: number): number {
  if (method === 'PICKUP') return 0
  if (method === 'EXPRESS') return EXPRESS_CENTS
  return subtotalCents >= FREE_STANDARD_THRESHOLD_CENTS ? 0 : STANDARD_CENTS
}

export const SHIPPING_METHOD_OPTIONS: { value: ShippingMethod; label: string; description: string }[] = [
  { value: 'STANDARD', label: 'Estándar', description: '3-5 días laborables' },
  { value: 'EXPRESS', label: 'Express', description: '24-48 horas' },
  { value: 'PICKUP', label: 'Recogida en tienda', description: 'Gratis, disponible en 24 horas' },
]
