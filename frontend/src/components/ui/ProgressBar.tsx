interface ProgressBarProps {
  current: number
  total: number
  label?: string
}

export function ProgressBar({ current, total, label = 'Progreso' }: ProgressBarProps) {
  return (
    <div
      className="flex gap-2"
      role="progressbar"
      aria-label={label}
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full ${i <= current ? 'bg-clay' : 'bg-sand'}`} />
      ))}
    </div>
  )
}
