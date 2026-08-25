/**
 * Composicion abstracta determinista a partir de un seed (slug de producto/origen).
 * Sustituye a fotografia de producto real (de la que no disponemos con licencia
 * verificada) sin recurrir a imagenes rotas ni a placeholders genericos grises.
 */
function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash
}

interface OriginArtProps {
  seed: string
  alt: string
  className?: string
}

export function OriginArt({ seed, alt, className = '' }: OriginArtProps) {
  const hash = hashSeed(seed)
  const hue = hash % 360
  const hue2 = (hue + 32) % 360
  const cx = 28 + (hash % 44)
  const cy = 22 + ((hash >> 8) % 40)
  const r = 22 + ((hash >> 16) % 22)
  const waveY = 55 + (hash % 20)

  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={alt} className={className}>
      <rect width="100" height="100" fill={`hsl(${hue}, 26%, 93%)`} />
      <circle cx={cx} cy={cy} r={r} fill={`hsl(${hue2}, 42%, 68%)`} opacity="0.5" />
      <path d={`M0,${waveY} Q50,${waveY - 18} 100,${waveY - 6} L100,100 L0,100 Z`} fill={`hsl(${hue}, 34%, 50%)`} opacity="0.32" />
    </svg>
  )
}
