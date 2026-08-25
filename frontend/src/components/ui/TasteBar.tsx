interface TasteBarProps {
  label: string
  value: number
  max?: number
}

export function TasteBar({ label, value, max = 5 }: TasteBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-sm text-ink-soft">{label}</span>
      <div className="flex gap-1" role="img" aria-label={`${label}: ${value} de ${max}`}>
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className={`h-2 w-6 rounded-full ${i < value ? 'bg-clay' : 'bg-sand'}`} />
        ))}
      </div>
    </div>
  )
}
