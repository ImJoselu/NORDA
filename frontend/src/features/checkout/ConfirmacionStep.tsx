import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatPrice } from '@/utils/coffeeLabels'
import type { Order } from '@/types/order'

export function ConfirmacionStep({ order }: { order: Order }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Pedido confirmado</p>
      <h2 className="font-display text-3xl text-ink">¡Gracias por tu compra!</h2>
      <p className="text-ink-soft">
        Hemos recibido tu pedido <span className="font-medium text-ink">{order.orderNumber}</span> por un total de{' '}
        <span className="font-medium text-ink">{formatPrice(order.totalCents)}</span>.
      </p>

      <Card className="w-full max-w-md p-6 text-left">
        <p className="mb-3 font-display text-lg text-ink">Enviado a</p>
        <p className="text-sm text-ink-soft">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-ink-soft">
          {order.shippingAddress.line1}
          {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
        </p>
        <p className="text-sm text-ink-soft">
          {order.shippingAddress.postalCode} {order.shippingAddress.city}, {order.shippingAddress.region}
        </p>
      </Card>

      <div className="flex gap-4">
        <Link to="/coffee">
          <Button variant="secondary">Seguir explorando</Button>
        </Link>
        <Link to="/account/orders">
          <Button>Ver mis pedidos</Button>
        </Link>
      </div>
    </div>
  )
}
