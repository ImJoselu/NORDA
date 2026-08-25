import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import {
  useAdminCountries,
  useAdminProducers,
  useAdminRegions,
  useCreateCountry,
  useCreateRegion,
  useUpdateCountry,
  useUpdateRegion,
} from '@/features/admin/hooks'
import type { AdminCountry, AdminCountryRequest, AdminRegion, AdminRegionRequest, Continent } from '@/types/admin'

const CONTINENT_LABELS: Record<Continent, string> = { AMERICA: 'América', AFRICA: 'África', ASIA: 'Asia' }

const SELECT_CLASS =
  'w-full rounded-lg border border-sand-dark bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40'

function emptyCountryForm(): AdminCountryRequest {
  return { name: '', slug: '', continent: 'AMERICA', description: '', latitude: 0, longitude: 0, typicalAltitudeMinM: 1000, typicalAltitudeMaxM: 2000 }
}

function CountryForm({ editing, onDone }: { editing: AdminCountry | null; onDone: () => void }) {
  const [form, setForm] = useState<AdminCountryRequest>(
    editing
      ? { name: editing.name, description: editing.description, latitude: editing.latitude, longitude: editing.longitude, typicalAltitudeMinM: editing.typicalAltitudeMinM, typicalAltitudeMaxM: editing.typicalAltitudeMaxM }
      : emptyCountryForm(),
  )
  const create = useCreateCountry()
  const update = useUpdateCountry()
  const isPending = create.isPending || update.isPending

  function submit() {
    if (editing) {
      update.mutate({ id: editing.id, request: form }, { onSuccess: onDone })
    } else {
      create.mutate(form, { onSuccess: onDone })
    }
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">{editing ? 'Editar país' : 'Nuevo país'}</p>
      <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      {!editing && (
        <>
          <Input label="Slug" value={form.slug ?? ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <div>
            <p className="mb-2 text-sm font-medium text-ink-soft">Continente</p>
            <select
              className={SELECT_CLASS}
              value={form.continent}
              onChange={(e) => setForm({ ...form, continent: e.target.value as Continent })}
            >
              {Object.entries(CONTINENT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </>
      )}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-soft">Descripción</label>
        <textarea
          className="rounded-lg border border-sand-dark bg-paper px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Latitud" type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })} />
        <Input label="Longitud" type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })} />
        <Input label="Altitud mín. (m)" type="number" value={form.typicalAltitudeMinM} onChange={(e) => setForm({ ...form, typicalAltitudeMinM: Number(e.target.value) })} />
        <Input label="Altitud máx. (m)" type="number" value={form.typicalAltitudeMaxM} onChange={(e) => setForm({ ...form, typicalAltitudeMaxM: Number(e.target.value) })} />
      </div>
      <div className="flex gap-3">
        <Button onClick={submit} disabled={isPending || !form.name || !form.description}>{isPending ? 'Guardando…' : 'Guardar'}</Button>
        <Button variant="secondary" onClick={onDone}>Cancelar</Button>
      </div>
    </Card>
  )
}

function emptyRegionForm(countryId: string): AdminRegionRequest {
  return { name: '', slug: '', countryId, description: '', latitude: 0, longitude: 0 }
}

function RegionForm({ editing, defaultCountryId, onDone }: { editing: AdminRegion | null; defaultCountryId: string; onDone: () => void }) {
  const [form, setForm] = useState<AdminRegionRequest>(
    editing
      ? { name: editing.name, description: editing.description, latitude: editing.latitude, longitude: editing.longitude }
      : emptyRegionForm(defaultCountryId),
  )
  const create = useCreateRegion()
  const update = useUpdateRegion()
  const isPending = create.isPending || update.isPending

  function submit() {
    if (editing) {
      update.mutate({ id: editing.id, request: form }, { onSuccess: onDone })
    } else {
      create.mutate(form, { onSuccess: onDone })
    }
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">{editing ? 'Editar región' : 'Nueva región'}</p>
      <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      {!editing && <Input label="Slug" value={form.slug ?? ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} />}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-soft">Descripción</label>
        <textarea
          className="rounded-lg border border-sand-dark bg-paper px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Latitud" type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })} />
        <Input label="Longitud" type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })} />
      </div>
      <div className="flex gap-3">
        <Button onClick={submit} disabled={isPending || !form.name || !form.description}>{isPending ? 'Guardando…' : 'Guardar'}</Button>
        <Button variant="secondary" onClick={onDone}>Cancelar</Button>
      </div>
    </Card>
  )
}

export function AdminOrigins() {
  const { data: countries } = useAdminCountries()
  const [editingCountry, setEditingCountry] = useState<AdminCountry | null | 'new'>(null)

  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const { data: regions } = useAdminRegions(selectedCountryId || undefined)
  const [editingRegion, setEditingRegion] = useState<AdminRegion | null | 'new'>(null)

  const [selectedRegionId, setSelectedRegionId] = useState<string>('')
  const { data: producers } = useAdminProducers(selectedRegionId || undefined)

  return (
    <div className="flex flex-col gap-10 px-8 py-10">
      <header>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Orígenes</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Países, regiones y productores</h1>
      </header>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Países</h2>
          {editingCountry === null && <Button size="sm" onClick={() => setEditingCountry('new')}>Nuevo país</Button>}
        </div>
        {editingCountry !== null && (
          <div className="mb-6 max-w-lg">
            <CountryForm editing={editingCountry === 'new' ? null : editingCountry} onDone={() => setEditingCountry(null)} />
          </div>
        )}
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-sand-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Continente</th>
                <th className="px-5 py-3 font-medium">Altitud típica</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {countries?.map((country) => (
                <tr key={country.id} className="border-b border-sand-dark/30 last:border-0 hover:bg-sand/40">
                  <td className="px-5 py-4 text-ink">{country.name}</td>
                  <td className="px-5 py-4 text-ink-soft">{CONTINENT_LABELS[country.continent]}</td>
                  <td className="px-5 py-4 text-ink-soft">{country.typicalAltitudeMinM}–{country.typicalAltitudeMaxM} m</td>
                  <td className="px-5 py-4">
                    <button onClick={() => setEditingCountry(country)} className="text-sm text-ink-soft hover:text-ink hover:underline">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl text-ink">Regiones</h2>
          <div className="flex items-center gap-3">
            <select className={SELECT_CLASS} value={selectedCountryId} onChange={(e) => setSelectedCountryId(e.target.value)}>
              <option value="">Todos los países</option>
              {countries?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {editingRegion === null && selectedCountryId && (
              <Button size="sm" onClick={() => setEditingRegion('new')}>Nueva región</Button>
            )}
          </div>
        </div>
        {editingRegion !== null && (
          <div className="mb-6 max-w-lg">
            <RegionForm
              editing={editingRegion === 'new' ? null : editingRegion}
              defaultCountryId={selectedCountryId}
              onDone={() => setEditingRegion(null)}
            />
          </div>
        )}
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-sand-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">País</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {regions?.map((region) => (
                <tr key={region.id} className="border-b border-sand-dark/30 last:border-0 hover:bg-sand/40">
                  <td className="px-5 py-4 text-ink">{region.name}</td>
                  <td className="px-5 py-4 text-ink-soft">{region.countryName}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => setEditingRegion(region)} className="text-sm text-ink-soft hover:text-ink hover:underline">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl text-ink">Productores</h2>
          <select className={SELECT_CLASS} value={selectedRegionId} onChange={(e) => setSelectedRegionId(e.target.value)}>
            <option value="">Selecciona una región…</option>
            {regions?.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-sand-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Región</th>
              </tr>
            </thead>
            <tbody>
              {producers?.map((producer) => (
                <tr key={producer.id} className="border-b border-sand-dark/30 last:border-0 hover:bg-sand/40">
                  <td className="px-5 py-4 text-ink">{producer.name}</td>
                  <td className="px-5 py-4 text-ink-soft">{producer.regionName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!selectedRegionId && (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">Selecciona una región para ver sus productores.</p>
          )}
        </Card>
      </section>
    </div>
  )
}
