interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  max?: number
}

export function StarRatingInput({ value, onChange, max = 5 }: StarRatingInputProps) {
  return (
    <div role="radiogroup" aria-label="Valoración" className="flex gap-1">
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue} estrellas`}
            onClick={() => onChange(starValue)}
            className={`text-2xl leading-none ${starValue <= value ? 'text-clay-dark' : 'text-sand-dark'}`}
          >
            {starValue <= value ? '★' : '☆'}
          </button>
        )
      })}
    </div>
  )
}
