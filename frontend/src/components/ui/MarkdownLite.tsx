/** Renderiza el subconjunto minimo de markdown usado en los articulos del Journal: encabezados ## y parrafos. */
export function MarkdownLite({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\s*\n/)

  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, index) => {
        const trimmed = block.trim()
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={index} className="mt-4 font-display text-2xl text-ink first:mt-0">
              {trimmed.slice(3)}
            </h2>
          )
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={index} className="mt-2 font-display text-xl text-ink">
              {trimmed.slice(4)}
            </h3>
          )
        }
        return (
          <p key={index} className="leading-relaxed text-ink-soft">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}
