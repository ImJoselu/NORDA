interface Option {
  value: string
  label: string
}

interface ChoiceStepProps {
  title: string
  subtitle?: string
  options: Option[]
  selected: string[]
  onToggle: (value: string) => void
}

export function ChoiceStep({ title, subtitle, options, selected, onToggle }: ChoiceStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              aria-pressed={isSelected}
              className={[
                'rounded-lg border px-4 py-4 text-sm font-medium transition-colors',
                isSelected ? 'border-ink bg-ink text-paper' : 'border-sand-dark text-ink hover:border-ink',
              ].join(' ')}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
