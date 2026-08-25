import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
  path: string
  type?: 'website' | 'article' | 'product'
  jsonLd?: object | object[]
}

/**
 * Meta tags dinamicos client-side (ADR-007, nivel 1). Cubre indexacion de
 * buscadores modernos, que ejecutan JS antes de indexar; NO cubre scrapers de
 * vista previa social (no ejecutan JS) - ver la ADR para el detalle y el
 * camino de mejora futura.
 */
export function Seo({ title, description, path, type = 'website', jsonLd }: SeoProps) {
  const fullTitle = title.includes('NØRDA') ? title : `${title} — NØRDA`
  const url = `${window.location.origin}${path}`
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="NØRDA" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {jsonLdList.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  )
}
