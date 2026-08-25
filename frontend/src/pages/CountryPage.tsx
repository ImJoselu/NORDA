import { Suspense, lazy } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { PhotoOrArt } from '@/components/ui/PhotoOrArt'
import { Seo } from '@/components/seo/Seo'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProductCard } from '@/features/catalog/ProductCard'
import { useCountryDetail } from '@/features/origins/hooks'
import { PROCESS_LABELS, pluralize } from '@/utils/coffeeLabels'
import { breadcrumbJsonLd } from '@/utils/jsonLd'

const CountryRegionMap = lazy(() =>
  import('@/features/originMap/CountryRegionMap').then((m) => ({ default: m.CountryRegionMap })),
)

export function CountryPage() {
  const { country = '' } = useParams()
  const { data, isLoading, isError } = useCountryDetail(country)

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="mt-6 h-24 w-full" />
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-danger">No hemos encontrado este país.</p>
        <Link to="/origins" className="mt-4 inline-block text-ink underline">
          Volver a orígenes
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <Seo
        title={data.name}
        description={data.description}
        path={`/origins/${data.slug}`}
        jsonLd={breadcrumbJsonLd([
          { name: 'Orígenes', url: `${window.location.origin}/origins` },
          { name: data.name, url: `${window.location.origin}/origins/${data.slug}` },
        ])}
      />

      <nav className="mb-8 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link to="/origins" className="hover:text-ink">Orígenes</Link>
      </nav>

      <PhotoOrArt
        src={`/images/origins/${data.slug}.jpg`}
        seed={data.slug}
        alt={`Paisaje cafetero de ${data.name}`}
        className="mb-10 h-64 w-full rounded-card sm:h-80"
      />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_260px]">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">{data.continent}</p>
          <h1 className="mt-2 font-display text-4xl text-ink">{data.name}</h1>
          <p className="mt-4 leading-relaxed text-ink-soft">{data.description}</p>
        </div>
        <Suspense fallback={<Skeleton className="aspect-square w-full" />}>
          <CountryRegionMap country={data} className="aspect-square w-full border border-sand-dark/60" />
        </Suspense>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Altitud típica</p>
          <p className="mt-1 font-display text-lg text-ink">{data.stats.altitudeMinM}–{data.stats.altitudeMaxM} m</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Procesos comunes</p>
          <p className="mt-1 text-sm text-ink">
            {data.stats.commonProcesses.map((p) => PROCESS_LABELS[p as keyof typeof PROCESS_LABELS] ?? p).join(', ')}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Perfil habitual</p>
          <p className="mt-1 text-sm text-ink">
            Acidez {data.stats.avgAcidity} · Cuerpo {data.stats.avgBody} · Dulzor {data.stats.avgSweetness}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Regiones principales</p>
          <p className="mt-1 text-sm text-ink">{data.stats.topRegions.join(', ')}</p>
        </Card>
      </div>

      <h2 className="mb-6 mt-14 font-display text-2xl text-ink">Regiones</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.regions.map((region) => (
          <Link key={region.slug} to={`/origins/${data.slug}/${region.slug}`}>
            <Card className="p-5">
              <p className="font-display text-lg text-ink">{region.name}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {pluralize(region.producerCount, 'productor', 'productores')} ·{' '}
                {pluralize(region.productCount, 'café', 'cafés')}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {data.relatedProducts.length > 0 && (
        <>
          <h2 className="mb-6 mt-14 font-display text-2xl text-ink">Cafés de {data.name}</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
            {data.relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
