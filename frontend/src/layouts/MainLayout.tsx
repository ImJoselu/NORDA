import { Link, Outlet } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { CartDrawer } from '@/features/cart/CartDrawer'
import { useCart } from '@/features/cart/hooks'
import { useAuthStore } from '@/store/authStore'
import { useCartDrawerStore } from '@/store/cartDrawerStore'

const NAV_LINKS = [
  { to: '/coffee', label: 'Café' },
  { to: '/origins', label: 'Orígenes' },
  { to: '/finder', label: 'Coffee Finder' },
  { to: '/journal', label: 'Journal' },
]

export function MainLayout() {
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)
  const openCart = useCartDrawerStore((state) => state.open)
  const { data: cart } = useCart()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-sand-dark/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" aria-label="NØRDA — Inicio">
            <Logo className="text-xl text-ink" markClassName="h-6 w-6 text-clay" />
          </Link>
          <nav className="hidden gap-8 text-sm text-ink-soft md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-sm text-ink-soft">
            <button onClick={openCart} aria-label="Carrito" className="hover:text-ink">
              Carrito{cart && cart.itemCount > 0 ? ` (${cart.itemCount})` : ''}
            </button>
            {status === 'authenticated' ? (
              <>
                {user?.roles.includes('ADMIN') && (
                  <Link to="/admin" className="hover:text-ink">
                    Admin
                  </Link>
                )}
                <Link to="/account" aria-label="Cuenta" className="hover:text-ink">
                  {user?.firstName ?? 'Cuenta'}
                </Link>
              </>
            ) : (
              <Link to="/login" aria-label="Iniciar sesión" className="hover:text-ink">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-sand-dark/60">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-ink-soft">
          <p>NØRDA — Descubre el café detrás de cada origen.</p>
        </div>
      </footer>

      <CartDrawer />
    </div>
  )
}
