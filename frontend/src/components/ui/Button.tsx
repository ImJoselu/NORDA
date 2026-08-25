import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink-soft',
  secondary: 'bg-transparent text-ink border border-ink/20 hover:border-ink',
  ghost: 'bg-transparent text-ink hover:bg-sand',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', disabled, ...props }, ref) => {
    const classes = [
      'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide',
      'transition-colors duration-200 ease-out',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay',
      'disabled:cursor-not-allowed disabled:opacity-40',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(' ')

    return <button ref={ref} className={classes} disabled={disabled} {...props} />
  },
)

Button.displayName = 'Button'
