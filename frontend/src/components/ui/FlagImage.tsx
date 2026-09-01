interface FlagImageProps {
  slug: string
  alt: string
  className?: string
}

/**
 * Bandera vectorial del pais (flagcdn.com) mostrada completa sobre un fondo
 * neutro (object-contain) para no recortar ni deformar el diseno oficial.
 */
export function FlagImage({ slug, alt, className = '' }: FlagImageProps) {
  return (
    <div className={`flex items-center justify-center overflow-hidden bg-sand ${className}`}>
      <img
        src={`/images/flags/${slug}.svg`}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-contain p-8"
      />
    </div>
  )
}
