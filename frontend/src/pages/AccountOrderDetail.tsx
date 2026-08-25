import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useOrder } from '@/features/orders/hooks'
import { ReorderButton } from '@/features/orders/ReorderButton'
import { formatPrice } from '@/utils/coffeeLabels'
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE, SHIPPING_METHOD_LABELS } from '@/utils/orderLabels'

export function AccountOrderDetail() {
  const { orderId = '' } = useParams()
  const { data: order, isLoading, isError } = useOrder(orderId)

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="mt-6 h-48 w-full" />
      </section>
    )
  }

  if (isError || !order) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-danger">No hemos encontrado este pedido.</p>
        <Link to="/account/orders" className="mt-4 inline-block text-ink underline">
          Volver a pedidos
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <nav className="mb-8 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link to="/account" className="hover:text-ink">Mi cuenta</Link>
        {' / '}
        <Link to="/account/orders" className="hover:text-ink">Pedidos</Link>
      </nav>

      <header className="mb-10 flex items-center justify-between">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Pedido</p>
          <h1 className="mt-2 font-display text-3xl text-ink">{order.orderNumber}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
          <ReorderButton orderId={order.id} />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr]">
        <Card className="flex flex-col divide-y divide-sand-dark/40 p-6">
          {order.items.map((item) => (
            <div key={item.productVariantId} className="flex justify-between py-3 text-sm first:pt-0 last:pb-0">
              <span className="text-ink">
                {item.quantity} × {item.productName} ({item.weightGrams} g)
              </span>
              <span className="text-ink-soft">{formatPrice(item.lineTotalCents)}</span>
            </div>
          ))}
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-2 p-6 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Envío ({SHIPPING_METHOD_LABELS[order.shippingMethod]})</span>
              <span>{order.shippingCents === 0 ? 'Gratis' : formatPrice(order.shippingCents)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>IVA (incluido)</span>
              <span>{formatPrice(order.taxCents)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-sand-dark/60 pt-2 font-medium text-ink">
              <span>Total</span>
              <span>{formatPrice(order.totalCents)}</span>
            </div>
          </Card>

          <Card className="p-6 text-sm">
            <p className="mb-2 font-medium text-ink">Enviado a</p>
            <p className="text-ink-soft">{order.shippingAddress.fullName}</p>
            <p className="text-ink-soft">
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
            </p>
            <p className="text-ink-soft">
              {order.shippingAddress.postalCode} {order.shippingAddress.city}, {order.shippingAddress.region}
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
