import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Seo } from '@/components/seo/Seo'
import { Skeleton } from '@/components/ui/Skeleton'
import { CatalogFilters } from '@/features/catalog/CatalogFilters'
import { Pagination } from '@/features/catalog/Pagination'
import { ProductCard } from '@/features/catalog/ProductCard'
import { SortSelect } from '@/features/catalog/SortSelect'
import { useProducts } from '@/features/catalog/hooks'
import type { ProductFilters } from '@/features/catalog/api'

export function Coffee() {
  const [filters, setFilters] = useState<ProductFilters>({ page: 0, size: 12, sort: 'RECOMMENDED' })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { data, isLoading, isError } = useProducts(filters)

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Seo
        title="Café de especialidad"
        description="Explora nuestro catálogo de café de especialidad por origen, proceso, tueste y método de preparación."
        path="/coffee"
      />

      <header className="mb-10 flex flex-col gap-2">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Catálogo</p>
        <h1 className="font-display text-4xl text-ink">Café de especialidad</h1>
        <p className="text-ink-soft">Explora por origen, proceso, tueste y método de preparación.</p>
      </header>

      <div className="flex items-center justify-between gap-4 border-b border-sand-dark/60 pb-4 md:hidden">
        <Button variant="secondary" size="sm" onClick={() => setFiltersOpen(true)}>
          Filtros
        </Button>
        <SortSelect value={filters.sort} onChange={(sort) => setFilters((f) => ({ ...f, sort, page: 0 }))} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">
          <CatalogFilters filters={filters} onChange={setFilters} />
        </aside>

        <div>
          <div className="mb-6 hidden justify-end md:flex">
            <SortSelect value={filters.sort} onChange={(sort) => setFilters((f) => ({ ...f, sort, page: 0 }))} />
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          )}

          {isError && <p className="text-danger">No se han podido cargar los cafés. Inténtalo de nuevo.</p>}

          {data && data.content.length === 0 && (
            <p className="text-ink-soft">No hay cafés que coincidan con estos filtros.</p>
          )}

          {data && data.content.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
                {data.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination page={data.page} totalPages={data.totalPages} onChange={(page) => setFilters((f) => ({ ...f, page }))} />
            </>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            className="flex-1 bg-ink/40"
            aria-label="Cerrar filtros"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="w-80 max-w-[85vw] overflow-y-auto bg-paper p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Filtros</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros" className="text-ink-soft hover:text-ink">
                ✕
              </button>
            </div>
            <CatalogFilters
              filters={filters}
              onChange={(next) => {
                setFilters(next)
                setFiltersOpen(false)
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
