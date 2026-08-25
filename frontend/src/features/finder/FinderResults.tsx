import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { OriginArt } from '@/components/ui/OriginArt'
import { formatPrice } from '@/utils/coffeeLabels'
import type { FinderResultItem } from '@/types/finder'

interface FinderResultsProps {
  results: FinderResultItem[]
  onRestart: () => void
}

export function FinderResults({ results, onRestart }: FinderResultsProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-ink-soft">No hemos encontrado un café que encaje bien con tus preferencias todavía.</p>
        <Button variant="secondary" onClick={onRestart}>Volver a intentar</Button>
      </div>
    )
  }

  const [best, ...rest] = results

  return (
    <div className="flex flex-col gap-12">
      <div>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Tu café ideal</p>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <OriginArt seed={best.product.slug} alt={best.product.name} className="aspect-square w-full rounded-card" />
          <div className="flex flex-col justify-center gap-4">
            <p className="font-display text-3xl text-ink">{best.matchPercent}% MATCH</p>
            <h2 className="font-display text-2xl text-ink">{best.product.name}</h2>
            <p className="text-ink-soft">{best.explanation}</p>
            <p className="font-medium text-ink">Desde {formatPrice(best.product.priceFromCents)}</p>
            <Link to={`/coffee/${best.product.slug}`}>
              <Button>Ver este café</Button>
            </Link>
          </div>
        </div>
      </div>

      {rest.length > 0 && (
        <div>
          <p className="mb-4 font-display text-sm uppercase tracking-[0.3em] text-clay-dark">También te puede gustar</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rest.map((result) => (
              <Link key={result.product.id} to={`/coffee/${result.product.slug}`}>
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg text-ink">{result.product.name}</p>
                    <p className="text-sm font-medium text-clay-dark">{result.matchPercent}%</p>
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{result.explanation}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Button variant="secondary" className="self-start" onClick={onRestart}>
        Volver a empezar
      </Button>
    </div>
  )
}
