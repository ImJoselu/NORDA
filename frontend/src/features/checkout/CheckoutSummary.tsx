import { Card } from '@/components/ui/Card'
import { formatPrice } from '@/utils/coffeeLabels'
import type { CartItem } from '@/types/cart'

interface CheckoutSummaryProps {
  items: CartItem[]
  subtotalCents: number
  shippingCents: number
}

export function CheckoutSummary({ items, subtotalCents, shippingCents }: CheckoutSummaryProps) {
  const totalCents = subtotalCents + shippingCents

  return (
    <Card className="flex flex-col gap-4 p-6">
      <p className="font-display text-lg text-ink">Resumen del pedido</p>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-ink-soft">
              {item.quantity} × {item.productName} ({item.weightGrams} g)
            </span>
            <span className="text-ink">{formatPrice(item.lineTotalCents)}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 border-t border-sand-dark/60 pt-4 text-sm">
        <div className="flex justify-between text-ink-soft">
          <span>Subtotal</span>
          <span>{formatPrice(subtotalCents)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>Envío</span>
          <span>{shippingCents === 0 ? 'Gratis' : formatPrice(shippingCents)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>IVA (21%, incluido)</span>
          <span>{formatPrice(Math.round((subtotalCents * 21) / 121))}</span>
        </div>
      </div>
      <div className="flex justify-between border-t border-sand-dark/60 pt-4 font-display text-lg text-ink">
        <span>Total</span>
        <span>{formatPrice(totalCents)}</span>
      </div>
    </Card>
  )
}
