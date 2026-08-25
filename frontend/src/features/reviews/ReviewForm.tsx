import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StarRatingInput } from '@/components/ui/StarRatingInput'
import { ApiError } from '@/services/httpClient'
import { useCreateReview } from './hooks'

const reviewSchema = z.object({
  title: z.string().min(1, 'Obligatorio').max(150),
  comment: z.string().min(10, 'Cuéntanos un poco más (mínimo 10 caracteres)').max(2000),
})
type ReviewFormValues = z.infer<typeof reviewSchema>

export function ReviewForm({ slug, onDone }: { slug: string; onDone: () => void }) {
  const [rating, setRating] = useState(5)
  const createReview = useCreateReview(slug)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({ resolver: zodResolver(reviewSchema) })

  const onSubmit = (values: ReviewFormValues) => {
    createReview.mutate(
      { rating, title: values.title, comment: values.comment },
      { onSuccess: onDone },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-card border border-sand-dark/60 p-6">
      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Tu valoración</p>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>
      <Input label="Título" error={errors.title?.message} {...register('title')} />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-soft" htmlFor="review-comment">
          Comentario
        </label>
        <textarea
          id="review-comment"
          rows={4}
          className="rounded-lg border border-sand-dark bg-paper px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40"
          {...register('comment')}
        />
        {errors.comment?.message && <p className="text-sm text-danger">{errors.comment.message}</p>}
      </div>

      {createReview.isError && (
        <p className="text-sm text-danger" role="alert">
          {createReview.error instanceof ApiError ? createReview.error.message : 'No se pudo publicar la reseña.'}
        </p>
      )}

      <Button type="submit" disabled={createReview.isPending} className="self-start">
        {createReview.isPending ? 'Publicando…' : 'Publicar reseña'}
      </Button>
    </form>
  )
}
