import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { useCartDrawerStore } from '@/store/cartDrawerStore'
import { formatPrice, METHOD_LABELS } from '@/utils/coffeeLabels'
import { useCart, useRemoveCartItem, useUpdateCartItem } from './hooks'

function grindLabel(grind: string): string {
  if (grind === 'WHOLE_BEAN') return 'Grano'
  return METHOD_LABELS[grind as keyof typeof METHOD_LABELS] ?? grind
}

export function CartDrawer() {
  const isOpen = useCartDrawerStore((state) => state.isOpen)
  const close = useCartDrawerStore((state) => state.close)
  const { data: cart, isLoading } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button className="flex-1 bg-ink/40" aria-label="Cerrar carrito" onClick={close} />
      <div className="flex w-96 max-w-[90vw] flex-col bg-paper">
        <div className="flex items-center justify-between border-b border-sand-dark/60 px-6 py-5">
          <h2 className="font-display text-lg text-ink">Tu carrito</h2>
          <button onClick={close} aria-label="Cerrar carrito" className="text-ink-soft hover:text-ink">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading && <p className="text-sm text-ink-soft">Cargando…</p>}

          {cart && cart.items.length === 0 && (
            <p className="text-sm text-ink-soft">Tu carrito está vacío.</p>
          )}

          {cart?.items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-sand-dark/40 py-4">
              <div className="flex-1">
                <Link to={`/coffee/${item.productSlug}`} onClick={close} className="font-medium text-ink hover:underline">
                  {item.productName}
                </Link>
                <p className="mt-1 text-xs text-ink-soft">
                  {item.weightGrams} g · {grindLabel(item.grind)}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <QuantityStepper
                    quantity={item.quantity}
                    disabled={updateItem.isPending}
                    onChange={(quantity) => updateItem.mutate({ itemId: item.id, quantity })}
                  />
                  <button
                    onClick={() => removeItem.mutate(item.id)}
                    className="text-xs text-ink-soft underline hover:text-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium text-ink">{formatPrice(item.lineTotalCents)}</p>
            </div>
          ))}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="border-t border-sand-dark/60 px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span className="font-display text-lg text-ink">{formatPrice(cart.subtotalCents)}</span>
            </div>
            <Link to="/checkout" onClick={close}>
              <Button className="w-full">Finalizar compra</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
