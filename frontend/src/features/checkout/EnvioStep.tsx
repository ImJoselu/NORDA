import { formatPrice } from '@/utils/coffeeLabels'
import { SHIPPING_METHOD_OPTIONS, estimateShippingCents } from './shippingEstimate'
import type { ShippingMethod } from '@/types/order'

interface EnvioStepProps {
  value: ShippingMethod
  onChange: (method: ShippingMethod) => void
  subtotalCents: number
}

export function EnvioStep({ value, onChange, subtotalCents }: EnvioStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl text-ink">Método de envío</h2>
      <div className="flex flex-col gap-3">
        {SHIPPING_METHOD_OPTIONS.map((option) => {
          const cost = estimateShippingCents(option.value, subtotalCents)
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                'flex items-center justify-between rounded-lg border px-5 py-4 text-left transition-colors',
                isSelected ? 'border-ink bg-ink text-paper' : 'border-sand-dark text-ink hover:border-ink',
              ].join(' ')}
            >
              <div>
                <p className="font-medium">{option.label}</p>
                <p className={isSelected ? 'text-sm text-paper/70' : 'text-sm text-ink-soft'}>{option.description}</p>
              </div>
              <p className="font-medium">{cost === 0 ? 'Gratis' : formatPrice(cost)}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
