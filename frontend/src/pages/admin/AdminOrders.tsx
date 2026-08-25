import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAdminOrders } from '@/features/admin/hooks'
import { formatPrice } from '@/utils/coffeeLabels'
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from '@/utils/orderLabels'
import type { OrderStatus } from '@/types/order'

const STATUS_FILTERS: (OrderStatus | 'ALL')[] = [
  'ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
]

export function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const { data: orders, isLoading } = useAdminOrders(statusFilter === 'ALL' ? undefined : statusFilter)

  return (
    <div className="px-8 py-10">
      <header className="mb-8">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Pedidos</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Gestión de pedidos</h1>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={[
              'rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide',
              statusFilter === status ? 'border-ink bg-ink text-paper' : 'border-sand-dark text-ink-soft hover:border-ink',
            ].join(' ')}
          >
            {status === 'ALL' ? 'Todos' : ORDER_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-sand-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-5 py-3 font-medium">Pedido</th>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
              <th className="px-5 py-3 font-medium">Artículos</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-b border-sand-dark/30 last:border-0 hover:bg-sand/40">
                <td className="px-5 py-4">
                  <Link to={`/admin/orders/${order.id}`} className="font-medium text-ink hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-4 text-ink-soft">
                  <p className="text-ink">{order.customerName}</p>
                  <p className="text-xs">{order.customerEmail}</p>
                </td>
                <td className="px-5 py-4 text-ink-soft">
                  {new Date(order.createdAt).toLocaleDateString('es-ES', { dateStyle: 'medium' })}
                </td>
                <td className="px-5 py-4 text-ink-soft">{order.itemCount}</td>
                <td className="px-5 py-4 font-medium text-ink">{formatPrice(order.totalCents)}</td>
                <td className="px-5 py-4">
                  <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders && orders.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-ink-soft">No hay pedidos con este estado.</p>
        )}
      </Card>
    </div>
  )
}
