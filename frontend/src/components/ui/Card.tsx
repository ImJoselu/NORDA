import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={['rounded-card border border-sand-dark/60 bg-paper', className].join(' ')}
      {...props}
    />
  )
}
