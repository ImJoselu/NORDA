import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAdjustInventory, useAdminInventory } from '@/features/admin/hooks'
import type { AdminInventoryItem, InventoryStatus } from '@/types/admin'

const STATUS_TONE: Record<InventoryStatus, 'success' | 'warning' | 'danger'> = {
  IN_STOCK: 'success',
  LOW_STOCK: 'warning',
  OUT_OF_STOCK: 'danger',
}

const STATUS_LABEL: Record<InventoryStatus, string> = {
  IN_STOCK: 'En stock',
  LOW_STOCK: 'Stock bajo',
  OUT_OF_STOCK: 'Agotado',
}

function InventoryRow({ item }: { item: AdminInventoryItem }) {
  const [editing, setEditing] = useState(false)
  const [stock, setStock] = useState(item.stock)
  const [minStock, setMinStock] = useState(item.minStock)
  const adjust = useAdjustInventory()

  function save() {
    adjust.mutate(
      { variantId: item.productVariantId, request: { stock, minStock } },
      { onSuccess: () => setEditing(false) },
    )
  }

  return (
    <tr className="border-b border-sand-dark/30 last:border-0 hover:bg-sand/40">
      <td className="px-5 py-4">
        <p className="text-ink">{item.productName}</p>
        <p className="text-xs text-ink-soft">{item.sku} · {item.weightGrams}g · {item.grind}</p>
      </td>
      <td className="px-5 py-4 text-ink-soft">
        {editing ? (
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-20 rounded-lg border border-sand-dark px-2 py-1 text-sm"
          />
        ) : (
          item.stock
        )}
      </td>
      <td className="px-5 py-4 text-ink-soft">{item.reserved}</td>
      <td className="px-5 py-4 text-ink-soft">{item.available}</td>
      <td className="px-5 py-4 text-ink-soft">
        {editing ? (
          <input
            type="number"
            min={0}
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
            className="w-20 rounded-lg border border-sand-dark px-2 py-1 text-sm"
          />
        ) : (
          item.minStock
        )}
      </td>
      <td className="px-5 py-4"><Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge></td>
      <td className="px-5 py-4">
        {editing ? (
          <div className="flex gap-2">
            <button onClick={save} disabled={adjust.isPending} className="text-sm text-clay-dark hover:underline">Guardar</button>
            <button onClick={() => setEditing(false)} className="text-sm text-ink-soft hover:underline">Cancelar</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="text-sm text-ink-soft hover:text-ink hover:underline">
            Ajustar
          </button>
        )}
      </td>
    </tr>
  )
}

export function AdminInventory() {
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const { data: items, isLoading } = useAdminInventory(lowStockOnly)

  return (
    <div className="px-8 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Inventario</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Inventario</h1>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />
          Solo stock bajo o agotado
        </label>
      </header>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-sand-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-5 py-3 font-medium">Variante</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Reservado</th>
              <th className="px-5 py-3 font-medium">Disponible</th>
              <th className="px-5 py-3 font-medium">Mínimo</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => <InventoryRow key={item.productVariantId} item={item} />)}
          </tbody>
        </table>
        {items && items.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-ink-soft">No hay variantes con stock bajo.</p>
        )}
      </Card>
    </div>
  )
}
