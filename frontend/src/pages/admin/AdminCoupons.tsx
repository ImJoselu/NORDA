import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAdminCoupons, useCreateCoupon, useDeleteCoupon, useUpdateCoupon } from '@/features/admin/hooks'
import { formatPrice } from '@/utils/coffeeLabels'
import type { AdminCouponRequest, CouponResponse, CouponType } from '@/types/admin'

const EMPTY_FORM: AdminCouponRequest = {
  code: '',
  type: 'PERCENTAGE',
  value: 10,
  minPurchaseCents: null,
  maxUses: null,
  active: true,
}

function CouponForm({ editing, onDone }: { editing: CouponResponse | null; onDone: () => void }) {
  const [form, setForm] = useState<AdminCouponRequest>(
    editing
      ? {
          code: editing.code,
          type: editing.type,
          value: editing.value,
          minPurchaseCents: editing.minPurchaseCents,
          maxUses: editing.maxUses,
          active: editing.active,
        }
      : EMPTY_FORM,
  )
  const createCoupon = useCreateCoupon()
  const updateCoupon = useUpdateCoupon()
  const isPending = createCoupon.isPending || updateCoupon.isPending

  function submit() {
    if (editing) {
      updateCoupon.mutate({ id: editing.id, request: form }, { onSuccess: onDone })
    } else {
      createCoupon.mutate(form, { onSuccess: onDone })
    }
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">{editing ? 'Editar cupón' : 'Nuevo cupón'}</p>

      <Input
        label="Código"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
        disabled={Boolean(editing)}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Tipo</p>
        <div className="flex gap-2">
          {(['PERCENTAGE', 'FIXED'] as CouponType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, type: t })}
              className={[
                'rounded-full border px-4 py-2 text-sm',
                form.type === t ? 'border-ink bg-ink text-paper' : 'border-sand-dark text-ink',
              ].join(' ')}
            >
              {t === 'PERCENTAGE' ? 'Porcentaje' : 'Importe fijo'}
            </button>
          ))}
        </div>
      </div>

      <Input
        label={form.type === 'PERCENTAGE' ? 'Valor (%)' : 'Valor (céntimos)'}
        type="number"
        min={1}
        value={form.value}
        onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
      />

      <Input
        label="Compra mínima (céntimos, opcional)"
        type="number"
        min={0}
        value={form.minPurchaseCents ?? ''}
        onChange={(e) => setForm({ ...form, minPurchaseCents: e.target.value ? Number(e.target.value) : null })}
      />

      <Input
        label="Usos máximos (opcional)"
        type="number"
        min={1}
        value={form.maxUses ?? ''}
        onChange={(e) => setForm({ ...form, maxUses: e.target.value ? Number(e.target.value) : null })}
      />

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
        Activo
      </label>

      <div className="flex gap-3">
        <Button onClick={submit} disabled={isPending || !form.code}>{isPending ? 'Guardando…' : 'Guardar'}</Button>
        <Button variant="secondary" onClick={onDone}>Cancelar</Button>
      </div>
    </Card>
  )
}

export function AdminCoupons() {
  const { data: coupons, isLoading } = useAdminCoupons()
  const deleteCoupon = useDeleteCoupon()
  const [editing, setEditing] = useState<CouponResponse | null | 'new'>(null)

  return (
    <div className="px-8 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Cupones</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Cupones de descuento</h1>
        </div>
        {editing === null && <Button onClick={() => setEditing('new')}>Nuevo cupón</Button>}
      </header>

      {editing !== null && (
        <div className="mb-8 max-w-md">
          <CouponForm editing={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-sand-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-5 py-3 font-medium">Código</th>
              <th className="px-5 py-3 font-medium">Valor</th>
              <th className="px-5 py-3 font-medium">Usos</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {coupons?.map((coupon) => (
              <tr key={coupon.id} className="border-b border-sand-dark/30 last:border-0 hover:bg-sand/40">
                <td className="px-5 py-4 font-medium text-ink">{coupon.code}</td>
                <td className="px-5 py-4 text-ink-soft">
                  {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : formatPrice(coupon.value)}
                  {coupon.minPurchaseCents ? ` · mín. ${formatPrice(coupon.minPurchaseCents)}` : ''}
                </td>
                <td className="px-5 py-4 text-ink-soft">{coupon.usedCount}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}</td>
                <td className="px-5 py-4">
                  <Badge tone={coupon.active ? 'success' : 'neutral'}>{coupon.active ? 'Activo' : 'Inactivo'}</Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <button onClick={() => setEditing(coupon)} className="text-sm text-ink-soft hover:text-ink hover:underline">
                      Editar
                    </button>
                    <button
                      onClick={() => deleteCoupon.mutate(coupon.id)}
                      className="text-sm text-ink-soft hover:text-danger hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons && coupons.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-ink-soft">Todavía no hay cupones.</p>
        )}
      </Card>
    </div>
  )
}
