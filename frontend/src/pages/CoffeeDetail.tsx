import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { OriginArt } from '@/components/ui/OriginArt'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Seo } from '@/components/seo/Seo'
import { Skeleton } from '@/components/ui/Skeleton'
import { TasteBar } from '@/components/ui/TasteBar'
import { VariantSelector } from '@/features/catalog/VariantSelector'
import { useProductDetail } from '@/features/catalog/hooks'
import { useAddToCart } from '@/features/cart/hooks'
import { FavoriteButton } from '@/features/favorites/FavoriteButton'
import { useProductReviews } from '@/features/reviews/hooks'
import { ReviewsSection } from '@/features/reviews/ReviewsSection'
import { useAuthStore } from '@/store/authStore'
import { useCartDrawerStore } from '@/store/cartDrawerStore'
import { METHOD_LABELS, PROCESS_LABELS, formatDate, formatPrice } from '@/utils/coffeeLabels'
import { breadcrumbJsonLd, productJsonLd } from '@/utils/jsonLd'

export function CoffeeDetail() {
  const { slug = '' } = useParams()
  const { data: product, isLoading, isError } = useProductDetail(slug)
  const { data: reviews } = useProductReviews(slug)
  const navigate = useNavigate()
  const authStatus = useAuthStore((state) => state.status)
  const openCart = useCartDrawerStore((state) => state.open)
  const addToCart = useAddToCart()
  const [quantity, setQuantity] = useState(1)

  const [weightGrams, setWeightGrams] = useState<number | null>(null)
  const [grind, setGrind] = useState<string | null>(null)

  useEffect(() => {
    if (!product) return
    const wholeBean250 = product.variants.find((v) => v.weightGrams === 250 && v.grind === 'WHOLE_BEAN')
    const first = wholeBean250 ?? product.variants[0]
    setWeightGrams(first.weightGrams)
    setGrind(first.grind)
  }, [product])

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </section>
    )
  }

  if (isError || !product) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-danger">No hemos encontrado este café.</p>
        <Link to="/coffee" className="mt-4 inline-block text-ink underline">
          Volver al catálogo
        </Link>
      </section>
    )
  }

  const selectedVariant = product.variants.find((v) => v.weightGrams === weightGrams && v.grind === grind)
  const productUrl = `${window.location.origin}/coffee/${product.slug}`

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <Seo
        title={product.name}
        description={product.shortDescription}
        path={`/coffee/${product.slug}`}
        type="product"
        jsonLd={[
          productJsonLd(product, reviews, productUrl),
          breadcrumbJsonLd([
            { name: 'Café', url: `${window.location.origin}/coffee` },
            { name: product.origin.countryName, url: `${window.location.origin}/origins/${product.origin.countrySlug}` },
            { name: product.origin.regionName, url: `${window.location.origin}/origins/${product.origin.countrySlug}/${product.origin.regionSlug}` },
            { name: product.name, url: productUrl },
          ]),
        ]}
      />

      <nav className="mb-8 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link to="/coffee" className="hover:text-ink">Café</Link>
        {' / '}
        <Link to={`/origins/${product.origin.countrySlug}`} className="hover:text-ink">{product.origin.countryName}</Link>
        {' / '}
        <Link to={`/origins/${product.origin.countrySlug}/${product.origin.regionSlug}`} className="hover:text-ink">
          {product.origin.regionName}
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="relative">
          <OriginArt seed={product.slug} alt={product.name} className="aspect-square w-full rounded-card" />
          <FavoriteButton productId={product.id} className="absolute right-4 top-4" />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">
              {product.origin.countryName} · {product.origin.regionName}
            </p>
            <h1 className="mt-2 font-display text-3xl text-ink md:text-4xl">{product.name}</h1>
            <p className="mt-3 text-ink-soft">{product.shortDescription}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge>{PROCESS_LABELS[product.process]}</Badge>
            <Badge>{product.altitudeM} m</Badge>
            <Badge>{product.variety}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tastingNotes.map((note) => (
              <Badge key={note} tone="neutral">{note}</Badge>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-y border-sand-dark/60 py-6">
            <TasteBar label="Acidez" value={product.acidity} />
            <TasteBar label="Cuerpo" value={product.body} />
            <TasteBar label="Dulzor" value={product.sweetness} />
          </div>

          <VariantSelector
            variants={product.variants}
            weightGrams={weightGrams ?? 0}
            grind={grind ?? ''}
            onSelectWeight={(w) => {
              setWeightGrams(w)
              const availableGrinds = product.variants.filter((v) => v.weightGrams === w)
              if (!availableGrinds.some((v) => v.grind === grind)) {
                setGrind(availableGrinds[0]?.grind ?? null)
              }
            }}
            onSelectGrind={setGrind}
          />

          {selectedVariant && (
            <div className="flex flex-col gap-4">
              <p className="font-display text-2xl text-ink">{formatPrice(selectedVariant.priceCents)}</p>
              <div className="flex items-center gap-4">
                <QuantityStepper quantity={quantity} onChange={setQuantity} />
                <Button
                  disabled={selectedVariant.availability === 'OUT_OF_STOCK' || addToCart.isPending}
                  onClick={() => {
                    if (authStatus !== 'authenticated') {
                      navigate('/login', { state: { from: `/coffee/${product.slug}` } })
                      return
                    }
                    addToCart.mutate(
                      { productVariantId: selectedVariant.id, quantity },
                      { onSuccess: openCart },
                    )
                  }}
                  className="flex-1"
                >
                  {selectedVariant.availability === 'OUT_OF_STOCK'
                    ? 'Agotado'
                    : addToCart.isPending
                      ? 'Añadiendo…'
                      : 'Añadir al carrito'}
                </Button>
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Métodos recomendados</p>
            <div className="flex flex-wrap gap-2">
              {product.recommendedMethods.map((method) => (
                <Badge key={method} tone="neutral">{METHOD_LABELS[method]}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-4 font-display text-2xl text-ink">Sobre este café</h2>
          <p className="leading-relaxed text-ink-soft">{product.longDescription}</p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-lg text-ink">Origen y trazabilidad</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Productor</dt>
              <dd className="text-right text-ink">{product.origin.producerName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Finca</dt>
              <dd className="text-right text-ink">{product.origin.farmName}</dd>
            </div>
            {product.lot && (
              <>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Lote</dt>
                  <dd className="text-right text-ink">{product.lot.code}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Cosecha</dt>
                  <dd className="text-right text-ink">{formatDate(product.lot.harvestDate)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Tueste</dt>
                  <dd className="text-right text-ink">{formatDate(product.lot.roastDate)}</dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>

      <ReviewsSection slug={product.slug} />
    </section>
  )
}
