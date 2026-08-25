import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ApiError } from '@/services/httpClient'
import { useRegister } from './hooks'
import { registerSchema, type RegisterFormValues } from './schemas'

export function RegisterForm() {
  const navigate = useNavigate()
  const registerUser = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = (values: RegisterFormValues) => {
    registerUser.mutate(values, { onSuccess: () => navigate('/account', { replace: true }) })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nombre" autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Apellidos" autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
      </div>
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <Input
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {registerUser.isError && (
        <p className="text-sm text-danger" role="alert">
          {registerUser.error instanceof ApiError ? registerUser.error.message : 'No se pudo crear la cuenta.'}
        </p>
      )}

      <Button type="submit" disabled={registerUser.isPending} className="w-full">
        {registerUser.isPending ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>

      <p className="text-sm text-ink-soft">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-ink underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
