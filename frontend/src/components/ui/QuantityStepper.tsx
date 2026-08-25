interface QuantityStepperProps {
  quantity: number
  onChange: (quantity: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export function QuantityStepper({ quantity, onChange, min = 1, max = 20, disabled }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-sand-dark">
      <button
        type="button"
        aria-label="Reducir cantidad"
        disabled={disabled || quantity <= min}
        onClick={() => onChange(quantity - 1)}
        className="px-3 py-1.5 text-ink disabled:opacity-30"
      >
        −
      </button>
      <span className="w-6 text-center text-sm text-ink">{quantity}</span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        disabled={disabled || quantity >= max}
        onClick={() => onChange(quantity + 1)}
        className="px-3 py-1.5 text-ink disabled:opacity-30"
      >
        +
      </button>
    </div>
  )
}
