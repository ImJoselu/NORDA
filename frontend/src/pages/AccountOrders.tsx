import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useOrders } from '@/features/orders/hooks'
import { formatPrice } from '@/utils/coffeeLabels'
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from '@/utils/orderLabels'

export function AccountOrders() {
  const { data: orders, isLoading } = useOrders()

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <nav className="mb-8 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link to="/account" className="hover:text-ink">Mi cuenta</Link>
      </nav>

      <header className="mb-10">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Mi cuenta</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Pedidos</h1>
      </header>

      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {orders && orders.length === 0 && (
        <p className="text-ink-soft">
          Todavía no has hecho ningún pedido.{' '}
          <Link to="/coffee" className="text-ink underline">
            Explora el catálogo
          </Link>
          .
        </p>
      )}

      <div className="flex flex-col gap-4">
        {orders?.map((order) => (
          <Link key={order.id} to={`/account/orders/${order.id}`}>
            <Card className="flex items-center justify-between p-5">
              <div>
                <p className="font-medium text-ink">{order.orderNumber}</p>
                <p className="text-sm text-ink-soft">
                  {new Date(order.createdAt).toLocaleDateString('es-ES', { dateStyle: 'long' })} · {order.itemCount} artículos
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                <p className="font-medium text-ink">{formatPrice(order.totalCents)}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
