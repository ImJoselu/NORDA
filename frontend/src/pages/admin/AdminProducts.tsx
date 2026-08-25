import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useActivateProduct, useAdminProducts, useArchiveProduct } from '@/features/admin/hooks'
import { formatPrice } from '@/utils/coffeeLabels'
import type { ProductSummary } from '@/types/catalog'

const STATUS_TONE: Record<ProductSummary['status'], 'neutral' | 'success' | 'warning'> = {
  DRAFT: 'warning',
  ACTIVE: 'success',
  ARCHIVED: 'neutral',
}

const STATUS_LABEL: Record<ProductSummary['status'], string> = {
  DRAFT: 'Borrador',
  ACTIVE: 'Activo',
  ARCHIVED: 'Archivado',
}

export function AdminProducts() {
  const { data: products, isLoading } = useAdminProducts()
  const archive = useArchiveProduct()
  const activate = useActivateProduct()

  return (
    <div className="px-8 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Cafés</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Catálogo</h1>
        </div>
        <Link to="/admin/products/new"><Button>Nuevo café</Button></Link>
      </header>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-sand-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-5 py-3 font-medium">Café</th>
              <th className="px-5 py-3 font-medium">Origen</th>
              <th className="px-5 py-3 font-medium">Desde</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-b border-sand-dark/30 last:border-0 hover:bg-sand/40">
                <td className="px-5 py-4">
                  <p className="text-ink">{product.name}</p>
                  <p className="text-xs text-ink-soft">{product.sku}</p>
                </td>
                <td className="px-5 py-4 text-ink-soft">{product.countryName} · {product.regionName}</td>
                <td className="px-5 py-4 font-medium text-ink">{formatPrice(product.priceFromCents)}</td>
                <td className="px-5 py-4"><Badge tone={STATUS_TONE[product.status]}>{STATUS_LABEL[product.status]}</Badge></td>
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <Link to={`/admin/products/${product.id}`} className="text-sm text-ink-soft hover:text-ink hover:underline">
                      Editar
                    </Link>
                    {product.status === 'ARCHIVED' ? (
                      <button onClick={() => activate.mutate(product.id)} className="text-sm text-ink-soft hover:text-ink hover:underline">
                        Activar
                      </button>
                    ) : (
                      <button onClick={() => archive.mutate(product.id)} className="text-sm text-ink-soft hover:text-danger hover:underline">
                        Archivar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
