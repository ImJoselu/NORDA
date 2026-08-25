import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/StarRating'
import { useAuthStore } from '@/store/authStore'
import { ReviewForm } from './ReviewForm'
import { useProductReviews } from './hooks'

export function ReviewsSection({ slug }: { slug: string }) {
  const { data, isLoading } = useProductReviews(slug)
  const status = useAuthStore((state) => state.status)
  const [showForm, setShowForm] = useState(false)

  if (isLoading || !data) return null

  return (
    <section className="mt-16 border-t border-sand-dark/60 pt-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink">Reseñas</h2>
          {data.reviewCount > 0 ? (
            <p className="mt-1 text-ink-soft">
              <StarRating value={data.averageRating} /> {data.averageRating.toFixed(1)}/5 · {data.reviewCount}{' '}
              {data.reviewCount === 1 ? 'reseña' : 'reseñas'}
            </p>
          ) : (
            <p className="mt-1 text-ink-soft">Todavía no hay reseñas para este café.</p>
          )}
        </div>
        {status === 'authenticated' && !showForm && (
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            Escribir una reseña
          </Button>
        )}
      </div>

      {showForm && <ReviewForm slug={slug} onDone={() => setShowForm(false)} />}

      <div className="mt-8 flex flex-col gap-6">
        {data.reviews.map((review) => (
          <div key={review.id} className="border-b border-sand-dark/40 pb-6">
            <div className="flex items-center justify-between">
              <p className="font-medium text-ink">{review.title}</p>
              <StarRating value={review.rating} />
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              {review.authorName} ·{' '}
              {new Date(review.createdAt).toLocaleDateString('es-ES', { dateStyle: 'long' })}
            </p>
            <p className="mt-2 text-ink-soft">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
