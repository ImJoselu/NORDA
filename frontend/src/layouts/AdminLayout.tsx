import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { useAuthStore } from '@/store/authStore'

const NAV_LINKS = [
  { to: '/admin', label: 'Panel', end: true },
  { to: '/admin/orders', label: 'Pedidos' },
  { to: '/admin/products', label: 'Cafés' },
  { to: '/admin/inventory', label: 'Inventario' },
  { to: '/admin/customers', label: 'Clientes' },
  { to: '/admin/reviews', label: 'Reseñas' },
  { to: '/admin/coupons', label: 'Cupones' },
  { to: '/admin/origins', label: 'Orígenes' },
]

export function AdminLayout() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-64 shrink-0 flex-col bg-ink text-paper">
        <div className="border-b border-paper/10 px-6 py-6">
          <Link to="/admin" aria-label="NØRDA — Panel">
            <Logo className="text-lg" markClassName="h-5 w-5 text-clay" />
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-paper/50">Panel de administración</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-6 text-sm">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2.5 transition-colors',
                  isActive ? 'bg-paper/10 text-paper' : 'text-paper/60 hover:bg-paper/5 hover:text-paper',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-paper/10 px-6 py-5 text-xs text-paper/50">
          <p className="text-paper/80">{user?.firstName} {user?.lastName}</p>
          <Link to="/" className="mt-2 inline-block hover:text-paper">
            ← Volver a la tienda
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
