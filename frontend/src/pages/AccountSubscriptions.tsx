import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { SubscriptionCard } from '@/features/subscriptions/SubscriptionCard'
import { SubscriptionForm } from '@/features/subscriptions/SubscriptionForm'
import { useSubscriptions } from '@/features/subscriptions/hooks'

export function AccountSubscriptions() {
  const { data: subscriptions, isLoading } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <nav className="mb-8 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link to="/account" className="hover:text-ink">Mi cuenta</Link>
      </nav>

      <header className="mb-10 flex items-center justify-between">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">NØRDA Explorer</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Suscripciones</h1>
        </div>
        {!showForm && <Button onClick={() => setShowForm(true)}>Nueva suscripción</Button>}
      </header>

      {showForm && (
        <div className="mb-10">
          <SubscriptionForm onDone={() => setShowForm(false)} />
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }, (_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      )}

      {subscriptions && subscriptions.length === 0 && !showForm && (
        <p className="text-ink-soft">Todavía no tienes ninguna suscripción activa.</p>
      )}

      <div className="flex flex-col gap-4">
        {subscriptions?.map((subscription) => (
          <SubscriptionCard key={subscription.id} subscription={subscription} />
        ))}
      </div>
    </section>
  )
}
