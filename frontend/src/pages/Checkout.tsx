import { CheckoutWizard } from '@/features/checkout/CheckoutWizard'

export function Checkout() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Checkout</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Finalizar compra</h1>
      </header>
      <CheckoutWizard />
    </section>
  )
}
