import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProductCard } from '@/features/catalog/ProductCard'
import { useFavorites } from '@/features/favorites/hooks'

export function AccountFavorites() {
  const { data: favorites, isLoading } = useFavorites()

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <nav className="mb-8 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link to="/account" className="hover:text-ink">Mi cuenta</Link>
      </nav>

      <header className="mb-10">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Mi cuenta</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Favoritos</h1>
      </header>

      {isLoading && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      )}

      {favorites && favorites.length === 0 && (
        <p className="text-ink-soft">
          Aún no has guardado ningún café.{' '}
          <Link to="/coffee" className="text-ink underline">
            Explora el catálogo
          </Link>
          .
        </p>
      )}

      {favorites && favorites.length > 0 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
