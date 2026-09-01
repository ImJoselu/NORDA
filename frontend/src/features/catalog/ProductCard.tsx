import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { CoffeePhoto } from '@/components/ui/CoffeePhoto'
import { FavoriteButton } from '@/features/favorites/FavoriteButton'
import { formatPrice, ROAST_LABELS } from '@/utils/coffeeLabels'
import type { ProductSummary } from '@/types/catalog'

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link to={`/coffee/${product.slug}`} className="group flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-card">
        <CoffeePhoto
          roastLevel={product.roastLevel}
          seed={product.slug}
          alt={`${product.name}, café de ${product.countryName}`}
          className="aspect-square w-full transition-transform duration-300 group-hover:scale-105"
        />
        <FavoriteButton productId={product.id} className="absolute right-3 top-3" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-wide text-ink-soft">
            {product.countryName} · {product.regionName}
          </p>
          <Badge tone="neutral">{ROAST_LABELS[product.roastLevel]}</Badge>
        </div>
        <h3 className="font-display text-lg text-ink">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-ink-soft">{product.shortDescription}</p>
        <p className="mt-1 text-sm font-medium text-ink">Desde {formatPrice(product.priceFromCents)}</p>
      </div>
    </Link>
  )
}
