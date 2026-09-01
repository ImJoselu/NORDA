import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { FlagImage } from '@/components/ui/FlagImage'
import { Seo } from '@/components/seo/Seo'
import { Skeleton } from '@/components/ui/Skeleton'
import { useOriginTree } from '@/features/origins/hooks'
import { pluralize } from '@/utils/coffeeLabels'

const WorldOriginMap = lazy(() =>
  import('@/features/originMap/WorldOriginMap').then((m) => ({ default: m.WorldOriginMap })),
)

const CONTINENT_LABELS: Record<string, string> = {
  AFRICA: 'África',
  AMERICA: 'América',
  ASIA: 'Asia',
}

export function Origins() {
  const { data, isLoading, isError } = useOriginTree()

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Seo
        title="Orígenes del café"
        description="Explora los países y regiones que cultivan el café de NØRDA, de continente a finca."
        path="/origins"
      />

      <header className="mb-12 flex flex-col gap-2">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Orígenes</p>
        <h1 className="font-display text-4xl text-ink">De dónde viene tu café</h1>
        <p className="max-w-2xl text-ink-soft">
          Explora los países y regiones que cultivan el café de NØRDA, de continente a finca.
        </p>
      </header>

      {isLoading && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      )}

      {isError && <p className="text-danger">No se han podido cargar los orígenes.</p>}

      {data && (
        <Suspense fallback={<Skeleton className="mb-16 h-[420px] w-full sm:h-[480px]" />}>
          <WorldOriginMap origins={data} className="mb-16 h-[420px] w-full border border-sand-dark/60 sm:h-[480px]" />
        </Suspense>
      )}

      {data?.map((group) => (
        <div key={group.continent} className="mb-14">
          <h2 className="mb-6 font-display text-2xl text-ink">{CONTINENT_LABELS[group.continent] ?? group.continent}</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {group.countries.map((country) => (
              <Link key={country.slug} to={`/origins/${country.slug}`} className="group flex flex-col gap-3">
                <div className="overflow-hidden rounded-card">
                  <FlagImage
                    slug={country.slug}
                    alt={`Bandera de ${country.name}`}
                    className="aspect-square w-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <p className="font-display text-lg text-ink">{country.name}</p>
                  <p className="text-sm text-ink-soft">{pluralize(country.productCount, 'café', 'cafés')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
