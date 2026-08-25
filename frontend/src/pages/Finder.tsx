import { FinderWizard } from '@/features/finder/FinderWizard'

export function Finder() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-12 flex flex-col gap-2">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-clay-dark">Coffee Finder</p>
        <h1 className="font-display text-4xl text-ink">Descubre tu café</h1>
        <p className="text-ink-soft">Cinco preguntas rápidas para encontrar el café perfecto para ti.</p>
      </header>
      <FinderWizard />
    </section>
  )
}
