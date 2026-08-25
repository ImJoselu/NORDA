import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { PhotoOrArt } from '@/components/ui/PhotoOrArt'
import { Seo } from '@/components/seo/Seo'
import { Skeleton } from '@/components/ui/Skeleton'
import { useJournalPosts } from '@/features/journal/hooks'
import { BLOG_CATEGORY_LABELS, formatJournalDate } from '@/utils/blogLabels'
import type { BlogCategory } from '@/types/blog'

const CATEGORIES = Object.keys(BLOG_CATEGORY_LABELS) as BlogCategory[]

export function Journal() {
  const [category, setCategory] = useState<BlogCategory | null>(null)
  const { data: posts, isLoading } = useJournalPosts(category ?? undefined)

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Seo
        title="Journal"
        description="Guías, orígenes, métodos de preparación y recetas de café de especialidad, escritos por el equipo editorial de NØRDA."
        path="/journal"
      />

      <header className="mb-10 max-w-2xl">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Journal</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Historias detrás de cada taza</h1>
        <p className="mt-4 text-ink-soft">
          Guías de preparación, perfiles de origen y el trabajo de los productores que hacen posible el café de especialidad.
        </p>
      </header>

      <div className="mb-10 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={[
            'rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide',
            category === null ? 'border-ink bg-ink text-paper' : 'border-sand-dark text-ink-soft hover:border-ink',
          ].join(' ')}
        >
          Todos
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={[
              'rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide',
              category === c ? 'border-ink bg-ink text-paper' : 'border-sand-dark text-ink-soft hover:border-ink',
            ].join(' ')}
          >
            {BLOG_CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-80 w-full" />)}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post) => (
          <Link key={post.id} to={`/journal/${post.slug}`}>
            <Card className="flex h-full flex-col overflow-hidden">
              <PhotoOrArt src={`/images/journal/${post.slug}.jpg`} seed={post.slug} alt={post.title} className="aspect-[4/3] w-full" />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-clay-dark">{BLOG_CATEGORY_LABELS[post.category]}</p>
                <h2 className="font-display text-lg text-ink">{post.title}</h2>
                <p className="flex-1 text-sm text-ink-soft">{post.excerpt}</p>
                <p className="mt-2 text-xs text-ink-soft">
                  {formatJournalDate(post.publishedAt)} · {post.readingTimeMinutes} min de lectura
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {posts && posts.length === 0 && <p className="text-ink-soft">No hay artículos en esta categoría todavía.</p>}
    </section>
  )
}
