import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useLogout } from '@/features/auth/hooks'
import { useAuthStore } from '@/store/authStore'

export function Account() {
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()

  if (!user) return null

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-24">
      <div>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Mi cuenta</p>
        <h1 className="mt-2 font-display text-3xl text-ink">
          Hola, {user.firstName}
        </h1>
      </div>

      <Card className="flex items-center justify-between p-6">
        <div>
          <p className="font-medium text-ink">{user.firstName} {user.lastName}</p>
          <p className="text-sm text-ink-soft">{user.email}</p>
        </div>
        <Button variant="secondary" onClick={() => logout.mutate()} disabled={logout.isPending}>
          {logout.isPending ? 'Saliendo…' : 'Cerrar sesión'}
        </Button>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/account/orders">
          <Card className="p-6 hover:border-ink">
            <p className="font-display text-lg text-ink">Pedidos</p>
            <p className="mt-1 text-sm text-ink-soft">Historial y estado de tus pedidos.</p>
          </Card>
        </Link>
        <Link to="/account/favorites">
          <Card className="p-6 hover:border-ink">
            <p className="font-display text-lg text-ink">Favoritos</p>
            <p className="mt-1 text-sm text-ink-soft">Los cafés que has guardado.</p>
          </Card>
        </Link>
        <Link to="/account/subscriptions">
          <Card className="p-6 hover:border-ink">
            <p className="font-display text-lg text-ink">NØRDA Explorer</p>
            <p className="mt-1 text-sm text-ink-soft">Tus suscripciones de café.</p>
          </Card>
        </Link>
      </div>

      <p className="text-sm text-ink-soft">
        Direcciones y reviews propias se irán añadiendo aquí en próximas fases.
      </p>
    </section>
  )
}
