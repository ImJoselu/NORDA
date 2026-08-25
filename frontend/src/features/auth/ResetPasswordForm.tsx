import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ApiError } from '@/services/httpClient'
import { useResetPassword } from './hooks'
import { resetPasswordSchema, type ResetPasswordFormValues } from './schemas'

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const resetPassword = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) })

  if (!token) {
    return <p className="text-sm text-danger">Enlace de restablecimiento no válido.</p>
  }

  if (resetPassword.isSuccess) {
    return (
      <p className="text-sm text-ink-soft">
        Contraseña actualizada.{' '}
        <Link to="/login" className="text-ink underline">
          Inicia sesión
        </Link>
        .
      </p>
    )
  }

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPassword.mutate({ token, newPassword: values.newPassword })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Nueva contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />

      {resetPassword.isError && (
        <p className="text-sm text-danger" role="alert">
          {resetPassword.error instanceof ApiError ? resetPassword.error.message : 'No se pudo actualizar la contraseña.'}
        </p>
      )}

      <Button type="submit" disabled={resetPassword.isPending} className="w-full">
        {resetPassword.isPending ? 'Actualizando…' : 'Actualizar contraseña'}
      </Button>
    </form>
  )
}
