import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAdminCustomers } from '@/features/admin/hooks'
import { formatPrice } from '@/utils/coffeeLabels'

export function AdminCustomers() {
  const { data: customers, isLoading } = useAdminCustomers()

  return (
    <div className="px-8 py-10">
      <header className="mb-8">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Clientes</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Clientes</h1>
      </header>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-sand-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Pedidos</th>
              <th className="px-5 py-3 font-medium">Gasto total</th>
              <th className="px-5 py-3 font-medium">Último pedido</th>
              <th className="px-5 py-3 font-medium">Suscripción</th>
              <th className="px-5 py-3 font-medium">Cliente desde</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((customer) => (
              <tr key={customer.id} className="border-b border-sand-dark/30 last:border-0 hover:bg-sand/40">
                <td className="px-5 py-4">
                  <p className="text-ink">{customer.name}</p>
                  <p className="text-xs text-ink-soft">{customer.email}</p>
                </td>
                <td className="px-5 py-4 text-ink-soft">{customer.orderCount}</td>
                <td className="px-5 py-4 font-medium text-ink">{formatPrice(customer.totalSpentCents)}</td>
                <td className="px-5 py-4 text-ink-soft">
                  {customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString('es-ES', { dateStyle: 'medium' }) : '—'}
                </td>
                <td className="px-5 py-4">
                  {customer.hasActiveSubscription ? <Badge tone="success">Activa</Badge> : <span className="text-ink-soft">—</span>}
                </td>
                <td className="px-5 py-4 text-ink-soft">
                  {new Date(customer.createdAt).toLocaleDateString('es-ES', { dateStyle: 'medium' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
