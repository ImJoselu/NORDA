import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ApiError } from '@/services/httpClient'
import { useLogin } from './hooks'
import { loginSchema, type LoginFormValues } from './schemas'

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/account'

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, { onSuccess: () => navigate(redirectTo, { replace: true }) })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {login.isError && (
        <p className="text-sm text-danger" role="alert">
          {login.error instanceof ApiError ? login.error.message : 'No se pudo iniciar sesión.'}
        </p>
      )}

      <Button type="submit" disabled={login.isPending} className="w-full">
        {login.isPending ? 'Entrando…' : 'Iniciar sesión'}
      </Button>

      <div className="flex justify-between text-sm text-ink-soft">
        <Link to="/forgot-password" className="hover:text-ink">
          ¿Olvidaste tu contraseña?
        </Link>
        <Link to="/register" className="hover:text-ink">
          Crear cuenta
        </Link>
      </div>
    </form>
  )
}
