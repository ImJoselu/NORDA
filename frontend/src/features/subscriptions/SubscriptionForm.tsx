import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useProducts } from '@/features/catalog/hooks'
import { useOriginTree } from '@/features/origins/hooks'
import { ApiError } from '@/services/httpClient'
import { FREQUENCY_LABELS, TYPE_LABELS } from '@/utils/subscriptionLabels'
import type { CreateSubscriptionRequest, SubscriptionFrequency, SubscriptionType } from '@/types/subscription'
import { useCreateSubscription } from './hooks'

const SELECT_CLASS =
  'w-full rounded-lg border border-sand-dark bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40'

export function SubscriptionForm({ onDone }: { onDone: () => void }) {
  const [coffeeCount, setCoffeeCount] = useState(1)
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('ONE_MONTH')
  const [type, setType] = useState<SubscriptionType>('SURPRISE')
  const [fixedProductIds, setFixedProductIds] = useState<string[]>([])
  const [originCountrySlug, setOriginCountryId] = useState('')

  const { data: productsPage } = useProducts({ size: 100 })
  const { data: origins } = useOriginTree()
  const countries = origins?.flatMap((g) => g.countries) ?? []

  const createSubscription = useCreateSubscription()

  function updateFixedProduct(index: number, productId: string) {
    setFixedProductIds((current) => {
      const next = [...current]
      next[index] = productId
      return next
    })
  }

  function submit() {
    const request: CreateSubscriptionRequest = {
      coffeeCount,
      frequency,
      type,
      fixedProductIds: type === 'FIXED' ? fixedProductIds.filter(Boolean) : undefined,
      originCountrySlug: type === 'ORIGIN_DISCOVERY' ? originCountrySlug || undefined : undefined,
    }
    createSubscription.mutate(request, { onSuccess: onDone })
  }

  const canSubmit =
    (type !== 'FIXED' || fixedProductIds.filter(Boolean).length === coffeeCount) &&
    (type !== 'ORIGIN_DISCOVERY' || Boolean(originCountrySlug))

  return (
    <div className="flex flex-col gap-6 rounded-card border border-sand-dark/60 p-6">
      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Número de cafés</p>
        <div className="flex gap-2">
          {[1, 2].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setCoffeeCount(n)
                setFixedProductIds((current) => current.slice(0, n))
              }}
              className={[
                'rounded-full border px-4 py-2 text-sm',
                coffeeCount === n ? 'border-ink bg-ink text-paper' : 'border-sand-dark text-ink',
              ].join(' ')}
            >
              {n} {n === 1 ? 'café' : 'cafés'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink-soft" htmlFor="sub-frequency">
          Frecuencia
        </label>
        <select
          id="sub-frequency"
          className={SELECT_CLASS}
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as SubscriptionFrequency)}
        >
          {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink-soft" htmlFor="sub-type">
          Tipo
        </label>
        <select
          id="sub-type"
          className={SELECT_CLASS}
          value={type}
          onChange={(e) => setType(e.target.value as SubscriptionType)}
        >
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {type === 'FIXED' && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-ink-soft">Elige tus cafés fijos</p>
          {Array.from({ length: coffeeCount }, (_, i) => (
            <select
              key={i}
              className={SELECT_CLASS}
              value={fixedProductIds[i] ?? ''}
              onChange={(e) => updateFixedProduct(i, e.target.value)}
            >
              <option value="">Selecciona un café…</option>
              {productsPage?.content.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}

      {type === 'ORIGIN_DISCOVERY' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-soft" htmlFor="sub-country">
            País de origen
          </label>
          <select
            id="sub-country"
            className={SELECT_CLASS}
            value={originCountrySlug}
            onChange={(e) => setOriginCountryId(e.target.value)}
          >
            <option value="">Selecciona un país…</option>
            {countries.map((country) => (
              <option key={country.slug} value={country.slug}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {createSubscription.isError && (
        <p className="text-sm text-danger" role="alert">
          {createSubscription.error instanceof ApiError ? createSubscription.error.message : 'No se pudo crear la suscripción.'}
        </p>
      )}

      <Button disabled={!canSubmit || createSubscription.isPending} onClick={submit} className="self-start">
        {createSubscription.isPending ? 'Creando…' : 'Crear suscripción'}
      </Button>
    </div>
  )
}
