import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAdminOrder, useUpdateOrderStatus } from '@/features/admin/hooks'
import { formatPrice } from '@/utils/coffeeLabels'
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE, SHIPPING_METHOD_LABELS } from '@/utils/orderLabels'
import type { OrderStatus } from '@/types/order'

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'CANCELLED', 'REFUNDED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'REFUNDED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
}

export function AdminOrderDetail() {
  const { orderId = '' } = useParams()
  const { data: order, isLoading } = useAdminOrder(orderId)
  const updateStatus = useUpdateOrderStatus()

  if (isLoading) {
    return (
      <div className="px-8 py-10">
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!order) return null

  const nextStates = TRANSITIONS[order.status]

  return (
    <div className="px-8 py-10">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link to="/admin/orders" className="hover:text-ink">← Pedidos</Link>
      </nav>

      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Pedido</p>
          <h1 className="mt-2 font-display text-3xl text-ink">{order.orderNumber}</h1>
        </div>
        <Badge tone={ORDER_STATUS_TONE[order.status]} className="text-sm">
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ink-soft">Artículos</p>
          <div className="flex flex-col divide-y divide-sand-dark/40">
            {order.items.map((item) => (
              <div key={item.productVariantId} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="text-ink">{item.productName}</p>
                  <p className="text-ink-soft">{item.weightGrams}g · {item.grind} · × {item.quantity}</p>
                </div>
                <p className="font-medium text-ink">{formatPrice(item.lineTotalCents)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-1 border-t border-sand-dark/40 pt-4 text-sm">
            <div className="flex justify-between text-ink-soft"><span>Subtotal</span><span>{formatPrice(order.subtotalCents)}</span></div>
            <div className="flex justify-between text-ink-soft"><span>Envío</span><span>{formatPrice(order.shippingCents)}</span></div>
            {order.discountCents > 0 && (
              <div className="flex justify-between text-ink-soft"><span>Descuento</span><span>−{formatPrice(order.discountCents)}</span></div>
            )}
            <div className="flex justify-between text-ink-soft"><span>Impuestos</span><span>{formatPrice(order.taxCents)}</span></div>
            <div className="flex justify-between pt-2 text-base font-medium text-ink"><span>Total</span><span>{formatPrice(order.totalCents)}</span></div>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ink-soft">Envío</p>
            <p className="text-sm text-ink">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-ink-soft">{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}</p>
            <p className="text-sm text-ink-soft">{order.shippingAddress.postalCode} {order.shippingAddress.city}, {order.shippingAddress.region}</p>
            <p className="text-sm text-ink-soft">{order.shippingAddress.country}</p>
            <p className="mt-2 text-sm text-ink-soft">{order.shippingAddress.phone}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-ink-soft">{SHIPPING_METHOD_LABELS[order.shippingMethod]}</p>
          </Card>

          {nextStates.length > 0 && (
            <Card className="p-6">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ink-soft">Cambiar estado</p>
              <div className="flex flex-col gap-2">
                {nextStates.map((next) => (
                  <button
                    key={next}
                    disabled={updateStatus.isPending}
                    onClick={() => updateStatus.mutate({ id: order.id, status: next })}
                    className="rounded-full border border-sand-dark px-4 py-2 text-sm text-ink hover:border-ink disabled:opacity-40"
                  >
                    Marcar como {ORDER_STATUS_LABELS[next]}
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
