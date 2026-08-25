const SORT_OPTIONS = [
  { value: 'RECOMMENDED', label: 'Recomendados' },
  { value: 'NEWEST', label: 'Novedades' },
  { value: 'PRICE_ASC', label: 'Precio: menor a mayor' },
  { value: 'PRICE_DESC', label: 'Precio: mayor a menor' },
]

interface SortSelectProps {
  value: string | undefined
  onChange: (value: string) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      aria-label="Ordenar por"
      className="rounded-lg border border-sand-dark bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40"
      value={value ?? 'RECOMMENDED'}
      onChange={(e) => onChange(e.target.value)}
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
