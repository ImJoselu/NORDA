import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Seo } from '@/components/seo/Seo'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProductCard } from '@/features/catalog/ProductCard'
import { useFeaturedProducts } from '@/features/catalog/hooks'
import { useOriginTree } from '@/features/origins/hooks'

// Leaflet pesa ~90kB gzip; se difiere para no bloquear el primer render del hero.
const WorldOriginMap = lazy(() =>
  import('@/features/originMap/WorldOriginMap').then((m) => ({ default: m.WorldOriginMap })),
)

export function Home() {
  const { data: featured, isLoading } = useFeaturedProducts()
  const { data: origins } = useOriginTree()

  return (
    <>
      <Seo
        title="NØRDA — Descubre el café detrás de cada origen"
        description="NØRDA es una plataforma de café de especialidad centrada en el descubrimiento de origen: mapa interactivo, recomendaciones personalizadas y catálogo curado."
        path="/"
      />

      <section className="mx-auto flex max-w-3xl flex-col items-start gap-8 px-6 py-32">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">NØRDA</p>
        <h1 className="font-display text-5xl leading-tight text-ink md:text-6xl">
          El café no empieza en tu taza.
          <br />
          Empieza en su origen.
        </h1>
        <p className="max-w-xl text-lg text-ink-soft">
          Descubre el café detrás de cada origen: productores, fincas y perfiles de sabor,
          explorados desde el continente hasta la finca.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/coffee">
            <Button size="lg">Explorar cafés</Button>
          </Link>
          <Link to="/origins">
            <Button size="lg" variant="secondary">
              Explorar orígenes
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Cafés destacados</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Selección de la semana</h2>
          </div>
          <Link to="/coffee" className="hidden text-sm text-ink-soft hover:text-ink md:block">
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          {featured?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Explora los orígenes</p>
            <h2 className="mt-2 font-display text-3xl text-ink">África, América, Asia</h2>
          </div>
          <Link to="/origins" className="hidden text-sm text-ink-soft hover:text-ink md:block">
            Ver todos los orígenes →
          </Link>
        </div>

        {origins && (
          <Suspense fallback={<Skeleton className="h-[420px] w-full sm:h-[480px]" />}>
            <WorldOriginMap origins={origins} className="h-[420px] w-full border border-sand-dark/60 sm:h-[480px]" />
          </Suspense>
        )}
      </section>

      <section className="border-y border-sand-dark/60 bg-sand/40">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-20">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Discover your coffee</p>
          <h2 className="font-display text-3xl text-ink md:text-4xl">Descubre tu café ideal</h2>
          <p className="text-ink-soft">
            Cinco preguntas rápidas sobre cómo lo preparas y qué sabores buscas. Nosotros nos encargamos del resto.
          </p>
          <Link to="/finder">
            <Button size="lg">Descubrir mi café</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
