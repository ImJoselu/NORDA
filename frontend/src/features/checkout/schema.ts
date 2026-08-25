import { z } from 'zod'

export const checkoutSchema = z.object({
  fullName: z.string().min(1, 'Obligatorio'),
  phone: z.string().min(6, 'Introduce un teléfono válido'),
  line1: z.string().min(1, 'Obligatorio'),
  line2: z.string().optional(),
  city: z.string().min(1, 'Obligatorio'),
  region: z.string().min(1, 'Obligatorio'),
  postalCode: z.string().min(3, 'Código postal inválido'),
  country: z.string().min(1, 'Obligatorio'),
  shippingMethod: z.enum(['STANDARD', 'EXPRESS', 'PICKUP']),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>

export const DATOS_FIELDS = ['fullName', 'phone'] as const
export const DIRECCION_FIELDS = ['line1', 'line2', 'city', 'region', 'postalCode', 'country'] as const
export const ENVIO_FIELDS = ['shippingMethod'] as const
