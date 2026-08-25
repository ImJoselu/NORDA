import { Link, useParams } from 'react-router-dom'
import { MarkdownLite } from '@/components/ui/MarkdownLite'
import { PhotoOrArt } from '@/components/ui/PhotoOrArt'
import { Seo } from '@/components/seo/Seo'
import { Skeleton } from '@/components/ui/Skeleton'
import { useJournalPost } from '@/features/journal/hooks'
import { BLOG_CATEGORY_LABELS, formatJournalDate } from '@/utils/blogLabels'
import { articleJsonLd, breadcrumbJsonLd } from '@/utils/jsonLd'

export function JournalPost() {
  const { slug = '' } = useParams()
  const { data: post, isLoading, isError } = useJournalPost(slug)

  if (isLoading) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16">
        <Skeleton className="mb-8 aspect-[16/9] w-full" />
        <Skeleton className="h-8 w-2/3" />
      </section>
    )
  }

  if (isError || !post) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-danger">No hemos encontrado este artículo.</p>
        <Link to="/journal" className="mt-4 inline-block text-ink underline">
          Volver al Journal
        </Link>
      </section>
    )
  }

  const url = `${window.location.origin}/journal/${post.slug}`

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/journal/${post.slug}`}
        type="article"
        jsonLd={[
          articleJsonLd({ title: post.title, description: post.excerpt, author: post.author, publishedAt: post.publishedAt, url }),
          breadcrumbJsonLd([
            { name: 'Journal', url: `${window.location.origin}/journal` },
            { name: post.title, url },
          ]),
        ]}
      />

      <nav className="mb-8 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link to="/journal" className="hover:text-ink">Journal</Link>
      </nav>

      <p className="text-xs font-medium uppercase tracking-wide text-clay-dark">{BLOG_CATEGORY_LABELS[post.category]}</p>
      <h1 className="mt-2 font-display text-3xl text-ink md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-ink-soft">
        {post.author} · {formatJournalDate(post.publishedAt)} · {post.readingTimeMinutes} min de lectura
      </p>

      <PhotoOrArt src={`/images/journal/${post.slug}.jpg`} seed={post.slug} alt={post.title} className="my-8 aspect-[16/9] w-full rounded-card" />

      <MarkdownLite content={post.content} />
    </article>
  )
}
