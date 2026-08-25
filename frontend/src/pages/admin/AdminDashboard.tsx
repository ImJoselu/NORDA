import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAdminDashboard } from '@/features/admin/hooks'
import { formatPrice } from '@/utils/coffeeLabels'

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </Card>
  )
}

function SalesChart({ data }: { data: { date: string; revenueCents: number; orderCount: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.revenueCents))
  const width = 700
  const height = 180
  const barGap = 4
  const barWidth = (width - barGap * (data.length - 1)) / data.length

  return (
    <svg viewBox={`0 0 ${width} ${height + 24}`} className="w-full" role="img" aria-label="Ventas de los últimos 14 días">
      {data.map((d, i) => {
        const barHeight = Math.max(2, (d.revenueCents / max) * height)
        const x = i * (barWidth + barGap)
        const y = height - barHeight
        const day = new Date(d.date).getDate()
        return (
          <g key={d.date}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx={3} className="fill-clay" opacity={d.revenueCents > 0 ? 1 : 0.15} />
            <text x={x + barWidth / 2} y={height + 16} textAnchor="middle" className="fill-ink-soft text-[9px]">
              {day}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard()

  return (
    <div className="px-8 py-10">
      <header className="mb-8">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Panel</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Resumen general</h1>
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Ingresos totales" value={formatPrice(data.totalRevenueCents)} hint={`${data.totalOrders} pedidos pagados`} />
            <StatCard label="Ticket medio" value={formatPrice(data.averageOrderValueCents)} />
            <StatCard label="Clientes" value={String(data.totalCustomers)} hint={`${data.recurringCustomers} recurrentes`} />
            <StatCard label="Suscripciones activas" value={String(data.activeSubscriptions)} />
          </div>

          {data.lowStockCount > 0 && (
            <Card className="border-warning/40 bg-warning/5 p-4">
              <p className="text-sm text-warning">
                {data.lowStockCount} {data.lowStockCount === 1 ? 'variante tiene' : 'variantes tienen'} stock bajo o agotado.
              </p>
            </Card>
          )}

          <Card className="p-6">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ink-soft">Ventas · últimos 14 días</p>
            <SalesChart data={data.salesLast14Days} />
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ink-soft">Cafés más vendidos</p>
              <ul className="flex flex-col gap-3">
                {data.topProducts.map((p) => (
                  <li key={p.name} className="flex items-center justify-between text-sm">
                    <span className="text-ink">{p.name}</span>
                    <span className="text-ink-soft">{p.unitsSold} uds · {formatPrice(p.revenueCents)}</span>
                  </li>
                ))}
                {data.topProducts.length === 0 && <p className="text-sm text-ink-soft">Sin datos todavía.</p>}
              </ul>
            </Card>

            <Card className="p-6">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ink-soft">Países con más pedidos</p>
              <ul className="flex flex-col gap-3">
                {data.topCountries.map((c) => (
                  <li key={c.countryCode} className="flex items-center justify-between text-sm">
                    <span className="text-ink">{c.countryCode}</span>
                    <span className="text-ink-soft">{c.orderCount} pedidos</span>
                  </li>
                ))}
                {data.topCountries.length === 0 && <p className="text-sm text-ink-soft">Sin datos todavía.</p>}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
