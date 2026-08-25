import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useForgotPassword } from './hooks'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from './schemas'

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) })

  if (forgotPassword.isSuccess) {
    return (
      <p className="text-sm text-ink-soft">
        Si el email existe en NØRDA, te hemos enviado un enlace para restablecer tu contraseña.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit((values) => forgotPassword.mutate(values.email))} className="flex flex-col gap-5">
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <Button type="submit" disabled={forgotPassword.isPending} className="w-full">
        {forgotPassword.isPending ? 'Enviando…' : 'Enviar enlace'}
      </Button>
    </form>
  )
}
