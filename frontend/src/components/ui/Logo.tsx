interface LogoMarkProps {
  className?: string
}

/**
 * Marca propia de NORDA: un grano de cafe visto en planta, dibujado a mano
 * (sin libreria de iconos) para que su silueta ovalada con hendidura central
 * se lea, a la vez, como una version organica de la O tachada de "NØRDA".
 * Monolinea con `currentColor` para heredar el color del contenedor (ink en
 * el header claro, paper en la barra lateral oscura del admin).
 */
export function LogoMark({ className = 'h-6 w-6' }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 4C24.5 9 24.5 23 16 28C7.5 23 7.5 9 16 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M16 8.5Q10.5 16 16 23.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

interface LogoProps {
  className?: string
  markClassName?: string
}

/** Lockup icono + wordmark, para el header y la barra lateral del admin. */
export function Logo({ className = '', markClassName }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 font-display tracking-widest ${className}`}>
      <LogoMark className={markClassName ?? 'h-5 w-5'} />
      NØRDA
    </span>
  )
}
