import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  FREQUENCY_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUS_TONE,
  TYPE_LABELS,
} from '@/utils/subscriptionLabels'
import type { Subscription } from '@/types/subscription'
import { useCancelSubscription, usePauseSubscription, useResumeSubscription, useSkipSubscription } from './hooks'

export function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  const pause = usePauseSubscription()
  const resume = useResumeSubscription()
  const cancel = useCancelSubscription()
  const skip = useSkipSubscription()

  const isCancelled = subscription.status === 'CANCELLED'
  const isPaused = subscription.status === 'PAUSED'
  const busy = pause.isPending || resume.isPending || cancel.isPending || skip.isPending

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg text-ink">{TYPE_LABELS[subscription.type]}</p>
          <p className="text-sm text-ink-soft">
            {subscription.coffeeCount} {subscription.coffeeCount === 1 ? 'café' : 'cafés'} ·{' '}
            {FREQUENCY_LABELS[subscription.frequency]}
          </p>
        </div>
        <Badge tone={SUBSCRIPTION_STATUS_TONE[subscription.status]}>
          {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
        </Badge>
      </div>

      {subscription.type === 'FIXED' && subscription.items.length > 0 && (
        <p className="text-sm text-ink-soft">{subscription.items.map((item) => item.productName).join(', ')}</p>
      )}
      {subscription.type === 'ORIGIN_DISCOVERY' && subscription.originCountryName && (
        <p className="text-sm text-ink-soft">Origen: {subscription.originCountryName}</p>
      )}

      {!isCancelled && (
        <p className="text-sm text-ink-soft">
          Próximo envío:{' '}
          <span className="text-ink">
            {new Date(subscription.nextDeliveryDate).toLocaleDateString('es-ES', { dateStyle: 'long' })}
          </span>
        </p>
      )}

      {!isCancelled && (
        <div className="flex flex-wrap gap-3">
          {isPaused ? (
            <Button size="sm" variant="secondary" disabled={busy} onClick={() => resume.mutate(subscription.id)}>
              Reanudar
            </Button>
          ) : (
            <>
              <Button size="sm" variant="secondary" disabled={busy} onClick={() => pause.mutate(subscription.id)}>
                Pausar
              </Button>
              <Button size="sm" variant="secondary" disabled={busy} onClick={() => skip.mutate(subscription.id)}>
                Omitir próximo envío
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => cancel.mutate(subscription.id)}>
            Cancelar
          </Button>
        </div>
      )}
    </Card>
  )
}
