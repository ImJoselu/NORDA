import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Introduce un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  firstName: z.string().min(1, 'Obligatorio').max(100),
  lastName: z.string().min(1, 'Obligatorio').max(100),
  email: z.string().email('Introduce un email válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(72),
})
export type RegisterFormValues = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('Introduce un email válido'),
})
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Mínimo 8 caracteres').max(72),
})
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
