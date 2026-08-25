import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  useAdminCountries,
  useAdminFarms,
  useAdminProducers,
  useAdminProduct,
  useAdminRegions,
  useCreateProduct,
  useUpdateProduct,
} from '@/features/admin/hooks'
import { METHOD_LABELS, PROCESS_LABELS, ROAST_LABELS } from '@/utils/coffeeLabels'
import type { BrewMethod, CoffeeProcess, RoastLevel } from '@/types/catalog'
import type { AdminProductRequest, ProductStatus } from '@/types/admin'

const SELECT_CLASS =
  'w-full rounded-lg border border-sand-dark bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40'

const STATUS_LABELS: Record<ProductStatus, string> = { DRAFT: 'Borrador', ACTIVE: 'Activo', ARCHIVED: 'Archivado' }

function emptyForm(): AdminProductRequest {
  return {
    sku: '', slug: '', name: '', shortDescription: '', longDescription: '',
    countryId: '', regionId: '', producerId: '', farmId: '',
    variety: '', process: 'WASHED', altitudeM: 1500, roastLevel: 'LIGHT',
    tastingNotes: [], acidity: 3, body: 3, sweetness: 3,
    recommendedMethods: [], status: 'DRAFT', basePriceCents: 1200,
  }
}

export function AdminProductForm() {
  const { productId } = useParams()
  const isEditing = Boolean(productId) && productId !== 'new'
  const navigate = useNavigate()

  const { data: existing, isLoading: loadingExisting } = useAdminProduct(isEditing ? productId! : '')
  const [form, setForm] = useState<AdminProductRequest>(emptyForm())
  const [tastingNotesText, setTastingNotesText] = useState('')

  useEffect(() => {
    if (existing) {
      setForm({
        sku: existing.sku, slug: existing.slug, name: existing.name,
        shortDescription: existing.shortDescription, longDescription: existing.longDescription,
        countryId: existing.countryId, regionId: existing.regionId, producerId: existing.producerId, farmId: existing.farmId,
        variety: existing.variety, process: existing.process, altitudeM: existing.altitudeM, roastLevel: existing.roastLevel,
        tastingNotes: existing.tastingNotes, acidity: existing.acidity, body: existing.body, sweetness: existing.sweetness,
        recommendedMethods: existing.recommendedMethods, status: existing.status, basePriceCents: existing.basePriceCents,
      })
      setTastingNotesText(existing.tastingNotes.join(', '))
    }
  }, [existing])

  const { data: countries } = useAdminCountries()
  const { data: regions } = useAdminRegions(form.countryId || undefined)
  const { data: producers } = useAdminProducers(form.regionId || undefined)
  const { data: farms } = useAdminFarms(form.producerId || undefined)

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const isPending = createProduct.isPending || updateProduct.isPending

  function toggleMethod(method: BrewMethod) {
    setForm((current) => ({
      ...current,
      recommendedMethods: current.recommendedMethods.includes(method)
        ? current.recommendedMethods.filter((m) => m !== method)
        : [...current.recommendedMethods, method],
    }))
  }

  function submit() {
    const request: AdminProductRequest = {
      ...form,
      tastingNotes: tastingNotesText.split(',').map((n) => n.trim()).filter(Boolean),
    }
    if (isEditing) {
      updateProduct.mutate({ id: productId!, request }, { onSuccess: () => navigate('/admin/products') })
    } else {
      createProduct.mutate(request, { onSuccess: () => navigate('/admin/products') })
    }
  }

  const canSubmit =
    form.name && form.shortDescription && form.longDescription &&
    form.countryId && form.regionId && form.producerId && form.farmId &&
    form.variety && (isEditing || (form.sku && form.slug)) &&
    form.recommendedMethods.length > 0

  if (isEditing && loadingExisting) {
    return <div className="px-8 py-10"><Skeleton className="h-96 w-full" /></div>
  }

  return (
    <div className="px-8 py-10">
      <header className="mb-8">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Cafés</p>
        <h1 className="mt-2 font-display text-3xl text-ink">{isEditing ? 'Editar café' : 'Nuevo café'}</h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="flex flex-col gap-4 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Información básica</p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Variedad" value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })} />
            </div>
            {!isEditing && (
              <div className="grid grid-cols-2 gap-4">
                <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
            )}
            <Input label="Descripción corta" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-soft">Descripción larga</label>
              <textarea
                className="rounded-lg border border-sand-dark bg-paper px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40"
                rows={5}
                value={form.longDescription}
                onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-4 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Origen</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-sm font-medium text-ink-soft">País</p>
                <select
                  className={SELECT_CLASS}
                  value={form.countryId}
                  onChange={(e) => setForm({ ...form, countryId: e.target.value, regionId: '', producerId: '', farmId: '' })}
                >
                  <option value="">Selecciona…</option>
                  {countries?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-ink-soft">Región</p>
                <select
                  className={SELECT_CLASS}
                  value={form.regionId}
                  onChange={(e) => setForm({ ...form, regionId: e.target.value, producerId: '', farmId: '' })}
                  disabled={!form.countryId}
                >
                  <option value="">Selecciona…</option>
                  {regions?.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-ink-soft">Productor</p>
                <select
                  className={SELECT_CLASS}
                  value={form.producerId}
                  onChange={(e) => setForm({ ...form, producerId: e.target.value, farmId: '' })}
                  disabled={!form.regionId}
                >
                  <option value="">Selecciona…</option>
                  {producers?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-ink-soft">Finca</p>
                <select
                  className={SELECT_CLASS}
                  value={form.farmId}
                  onChange={(e) => setForm({ ...form, farmId: e.target.value })}
                  disabled={!form.producerId}
                >
                  <option value="">Selecciona…</option>
                  {farms?.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
            </div>
            <Input label="Altitud (m)" type="number" value={form.altitudeM} onChange={(e) => setForm({ ...form, altitudeM: Number(e.target.value) })} />
          </Card>

          <Card className="flex flex-col gap-4 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Perfil sensorial</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-sm font-medium text-ink-soft">Proceso</p>
                <select className={SELECT_CLASS} value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value as CoffeeProcess })}>
                  {Object.entries(PROCESS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-ink-soft">Tueste</p>
                <select className={SELECT_CLASS} value={form.roastLevel} onChange={(e) => setForm({ ...form, roastLevel: e.target.value as RoastLevel })}>
                  {Object.entries(ROAST_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
            </div>
            <Input label="Notas de cata (separadas por comas)" value={tastingNotesText} onChange={(e) => setTastingNotesText(e.target.value)} />
            <div className="grid grid-cols-3 gap-4">
              <Input label="Acidez (1-5)" type="number" min={1} max={5} value={form.acidity} onChange={(e) => setForm({ ...form, acidity: Number(e.target.value) })} />
              <Input label="Cuerpo (1-5)" type="number" min={1} max={5} value={form.body} onChange={(e) => setForm({ ...form, body: Number(e.target.value) })} />
              <Input label="Dulzor (1-5)" type="number" min={1} max={5} value={form.sweetness} onChange={(e) => setForm({ ...form, sweetness: Number(e.target.value) })} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink-soft">Métodos recomendados</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(METHOD_LABELS) as BrewMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => toggleMethod(method)}
                    className={[
                      'rounded-full border px-4 py-2 text-sm',
                      form.recommendedMethods.includes(method) ? 'border-ink bg-ink text-paper' : 'border-sand-dark text-ink',
                    ].join(' ')}
                  >
                    {METHOD_LABELS[method]}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-4 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Publicación</p>
            <Input label="Precio base (céntimos, 250g)" type="number" min={1} value={form.basePriceCents} onChange={(e) => setForm({ ...form, basePriceCents: Number(e.target.value) })} />
            <div>
              <p className="mb-2 text-sm font-medium text-ink-soft">Estado</p>
              <select className={SELECT_CLASS} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}>
                {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            {!isEditing && (
              <p className="text-xs text-ink-soft">
                Al crear el café se generan automáticamente 3 variantes en grano (250g, 500g, 1000g) con stock inicial en cero. Ajusta el stock desde Inventario.
              </p>
            )}
          </Card>

          <div className="flex gap-3">
            <Button onClick={submit} disabled={!canSubmit || isPending}>{isPending ? 'Guardando…' : 'Guardar café'}</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/products')}>Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
