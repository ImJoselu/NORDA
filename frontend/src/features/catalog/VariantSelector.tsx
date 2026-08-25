import { Badge } from '@/components/ui/Badge'
import { METHOD_LABELS } from '@/utils/coffeeLabels'
import type { ProductVariant } from '@/types/catalog'

interface VariantSelectorProps {
  variants: ProductVariant[]
  weightGrams: number
  grind: string
  onSelectWeight: (weightGrams: number) => void
  onSelectGrind: (grind: string) => void
}

const AVAILABILITY_TONE: Record<string, 'success' | 'warning' | 'danger'> = {
  IN_STOCK: 'success',
  LOW_STOCK: 'warning',
  OUT_OF_STOCK: 'danger',
}

const AVAILABILITY_LABEL: Record<string, string> = {
  IN_STOCK: 'En stock',
  LOW_STOCK: 'Pocas unidades',
  OUT_OF_STOCK: 'Agotado',
}

export function VariantSelector({ variants, weightGrams, grind, onSelectWeight, onSelectGrind }: VariantSelectorProps) {
  const weights = [...new Set(variants.map((v) => v.weightGrams))].sort((a, b) => a - b)
  const grindsForWeight = variants.filter((v) => v.weightGrams === weightGrams)
  const selectedVariant = variants.find((v) => v.weightGrams === weightGrams && v.grind === grind)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Formato</p>
        <div className="flex flex-wrap gap-2">
          {weights.map((weight) => (
            <button
              key={weight}
              type="button"
              onClick={() => onSelectWeight(weight)}
              className={[
                'rounded-full border px-4 py-2 text-sm transition-colors',
                weight === weightGrams ? 'border-ink bg-ink text-paper' : 'border-sand-dark text-ink hover:border-ink',
              ].join(' ')}
            >
              {weight >= 1000 ? `${weight / 1000} kg` : `${weight} g`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Molienda</p>
        <div className="flex flex-wrap gap-2">
          {grindsForWeight.map((variant) => (
            <button
              key={variant.grind}
              type="button"
              onClick={() => onSelectGrind(variant.grind)}
              className={[
                'rounded-full border px-4 py-2 text-sm transition-colors',
                variant.grind === grind ? 'border-ink bg-ink text-paper' : 'border-sand-dark text-ink hover:border-ink',
              ].join(' ')}
            >
              {variant.grind === 'WHOLE_BEAN' ? 'Grano' : METHOD_LABELS[variant.grind as keyof typeof METHOD_LABELS]}
            </button>
          ))}
        </div>
      </div>

      {selectedVariant && (
        <Badge tone={AVAILABILITY_TONE[selectedVariant.availability]}>
          {AVAILABILITY_LABEL[selectedVariant.availability]}
        </Badge>
      )}
    </div>
  )
}
