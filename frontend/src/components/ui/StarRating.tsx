interface StarRatingProps {
  value: number
  max?: number
}

export function StarRating({ value, max = 5 }: StarRatingProps) {
  return (
    <span className="text-clay-dark" role="img" aria-label={`${value} de ${max} estrellas`}>
      {Array.from({ length: max }, (_, i) => (i < Math.round(value) ? '★' : '☆')).join('')}
    </span>
  )
}
