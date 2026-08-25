import { useOriginTree } from '@/features/origins/hooks'
import { METHOD_LABELS, PROCESS_LABELS, ROAST_LABELS } from '@/utils/coffeeLabels'
import type { ProductFilters } from './api'

interface CatalogFiltersProps {
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
}

const SELECT_CLASS =
  'w-full rounded-lg border border-sand-dark bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40'

export function CatalogFilters({ filters, onChange }: CatalogFiltersProps) {
  const { data: origins } = useOriginTree()
  const countries = origins?.flatMap((group) => group.countries) ?? []

  function update<K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) {
    onChange({ ...filters, [key]: value, page: 0 })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="filter-country">
          País
        </label>
        <select
          id="filter-country"
          className={SELECT_CLASS}
          value={filters.country ?? ''}
          onChange={(e) => update('country', e.target.value || undefined)}
        >
          <option value="">Todos</option>
          {countries
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((country) => (
              <option key={country.slug} value={country.slug}>
                {country.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="filter-process">
          Proceso
        </label>
        <select
          id="filter-process"
          className={SELECT_CLASS}
          value={filters.process ?? ''}
          onChange={(e) => update('process', e.target.value || undefined)}
        >
          <option value="">Todos</option>
          {Object.entries(PROCESS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="filter-roast">
          Tueste
        </label>
        <select
          id="filter-roast"
          className={SELECT_CLASS}
          value={filters.roast ?? ''}
          onChange={(e) => update('roast', e.target.value || undefined)}
        >
          <option value="">Todos</option>
          {Object.entries(ROAST_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="filter-method">
          Método recomendado
        </label>
        <select
          id="filter-method"
          className={SELECT_CLASS}
          value={filters.method ?? ''}
          onChange={(e) => update('method', e.target.value || undefined)}
        >
          <option value="">Todos</option>
          {Object.entries(METHOD_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
