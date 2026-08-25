import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useIsFavorite, useToggleFavorite } from './hooks'

interface FavoriteButtonProps {
  productId: string
  className?: string
}

export function FavoriteButton({ productId, className = '' }: FavoriteButtonProps) {
  const navigate = useNavigate()
  const status = useAuthStore((state) => state.status)
  const isFavorite = useIsFavorite(productId)
  const toggle = useToggleFavorite()

  function handleClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (status !== 'authenticated') {
      navigate('/login')
      return
    }
    toggle.mutate(productId)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggle.isPending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-lg transition-colors ${isFavorite ? 'text-clay-dark' : 'text-ink-soft hover:text-ink'} ${className}`}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  )
}
