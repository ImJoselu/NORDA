import { Link, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { PhotoOrArt } from '@/components/ui/PhotoOrArt'
import { Seo } from '@/components/seo/Seo'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProductCard } from '@/features/catalog/ProductCard'
import { useRegionDetail } from '@/features/origins/hooks'
import { breadcrumbJsonLd } from '@/utils/jsonLd'

export function RegionPage() {
  const { country = '', region = '' } = useParams()
  const { data, isLoading, isError } = useRegionDetail(country, region)

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
        <p className="text-danger">No hemos encontrado esta región.</p>
        <Link to="/origins" className="mt-4 inline-block text-ink underline">
          Volver a orígenes
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <Seo
        title={`${data.name}, ${data.country.name}`}
        description={data.description}
        path={`/origins/${data.country.slug}/${data.slug}`}
        jsonLd={breadcrumbJsonLd([
          { name: 'Orígenes', url: `${window.location.origin}/origins` },
          { name: data.country.name, url: `${window.location.origin}/origins/${data.country.slug}` },
          { name: data.name, url: `${window.location.origin}/origins/${data.country.slug}/${data.slug}` },
        ])}
      />

      <nav className="mb-8 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link to="/origins" className="hover:text-ink">Orígenes</Link>
        {' / '}
        <Link to={`/origins/${data.country.slug}`} className="hover:text-ink">{data.country.name}</Link>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_260px]">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">{data.country.name}</p>
          <h1 className="mt-2 font-display text-4xl text-ink">{data.name}</h1>
          <p className="mt-4 leading-relaxed text-ink-soft">{data.description}</p>
        </div>
        <PhotoOrArt
          src={`/images/origins/${data.country.slug}.jpg`}
          seed={data.slug}
          alt={`Región: ${data.name}, ${data.country.name}`}
          className="aspect-square w-full rounded-card"
        />
      </div>

      <h2 className="mb-6 mt-14 font-display text-2xl text-ink">Productores</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.producers.map((producer) => (
          <Card key={producer.slug} className="p-5">
            <p className="font-display text-lg text-ink">{producer.name}</p>
            <p className="mt-1 text-sm text-ink-soft">{producer.description}</p>
            {producer.farms.length > 0 && (
              <p className="mt-3 text-xs uppercase tracking-wide text-ink-soft">
                {producer.farms.map((farm) => `${farm.name} (${farm.altitudeM} m)`).join(' · ')}
              </p>
            )}
          </Card>
        ))}
      </div>

      {data.products.length > 0 && (
        <>
          <h2 className="mb-6 mt-14 font-display text-2xl text-ink">Cafés de {data.name}</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
