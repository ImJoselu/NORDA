import { useState } from 'react'
import { OriginArt } from './OriginArt'

interface PhotoOrArtProps {
  src: string
  seed: string
  alt: string
  className?: string
}

/**
 * Fotografia real (Wikimedia Commons, ver public/images/CREDITS.md) con fallback
 * automatico a OriginArt si el archivo falta o falla al cargar - ningun origen o
 * articulo se queda con un hueco roto aunque no exista foto para ese slug.
 */
export function PhotoOrArt({ src, seed, alt, className = '' }: PhotoOrArtProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <OriginArt seed={seed} alt={alt} className={className} />
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
