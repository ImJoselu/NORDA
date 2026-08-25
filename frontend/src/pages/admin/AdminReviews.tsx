import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { StarRating } from '@/components/ui/StarRating'
import { useAdminReviews, useHideReview, useRestoreReview } from '@/features/admin/hooks'

export function AdminReviews() {
  const { data: reviews, isLoading } = useAdminReviews()
  const hide = useHideReview()
  const restore = useRestoreReview()

  return (
    <div className="px-8 py-10">
      <header className="mb-8">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Reseñas</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Moderación de reseñas</h1>
      </header>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {reviews?.map((review) => (
          <Card key={review.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-medium text-ink">{review.title}</p>
                  <Badge tone={review.status === 'VISIBLE' ? 'success' : 'neutral'}>
                    {review.status === 'VISIBLE' ? 'Visible' : 'Oculta'}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{review.productName} · {review.customerName}</p>
                <div className="mt-2"><StarRating value={review.rating} /></div>
                <p className="mt-3 max-w-2xl text-sm text-ink">{review.comment}</p>
                <p className="mt-2 text-xs text-ink-soft">
                  {new Date(review.createdAt).toLocaleDateString('es-ES', { dateStyle: 'long' })}
                </p>
              </div>
              <div>
                {review.status === 'VISIBLE' ? (
                  <button
                    onClick={() => hide.mutate(review.id)}
                    disabled={hide.isPending}
                    className="rounded-full border border-sand-dark px-4 py-2 text-sm text-ink hover:border-danger hover:text-danger"
                  >
                    Ocultar
                  </button>
                ) : (
                  <button
                    onClick={() => restore.mutate(review.id)}
                    disabled={restore.isPending}
                    className="rounded-full border border-sand-dark px-4 py-2 text-sm text-ink hover:border-ink"
                  >
                    Restaurar
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {reviews && reviews.length === 0 && <p className="text-sm text-ink-soft">Todavía no hay reseñas.</p>}
      </div>
    </div>
  )
}
