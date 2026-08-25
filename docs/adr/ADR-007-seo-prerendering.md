# ADR-007: Estrategia de SEO en una SPA sin servidor propio

## Estado
Aceptado

## Contexto
ADR-001 fija NØRDA como una SPA de React servida como estáticos (sin Next.js/Remix, sin
runtime de servidor Node en producción) y deja pendiente decidir cómo resolver el SEO de las
rutas indexables (`/coffee/{slug}`, `/origins/{country}`, `/origins/{country}/{region}`,
`/journal/{slug}`) cuando esa misma decisión bloquea el prerenderizado clásico (SSR/SSG), que
normalmente necesita un runtime de servidor o un paso de build con acceso a datos.

Hay dos audiencias distintas a servir, con necesidades distintas:

1. **Crawlers de buscadores modernos** (Googlebot, Bingbot): ejecutan JavaScript antes de
   indexar, así que un `<title>` y meta tags inyectados en el cliente sí acaban indexados,
   aunque con una cola de renderizado adicional.
2. **Scrapers de vista previa de redes sociales** (Slack, Twitter/X, Discord, WhatsApp,
   iMessage): NO ejecutan JavaScript. Solo leen el HTML de la primera respuesta. Si el
   `<head>` inicial no trae ya el Open Graph correcto, la tarjeta de vista previa cae al
   fallback genérico de `index.html` sin importar qué haga React después.

## Decisión
Se adopta una solución de dos niveles, deliberadamente asimétrica:

- **Nivel 1 — meta tags dinámicos en cliente (`react-helmet-async`)**: cada ruta indexable
  calcula su propio `title`, `description`, `canonical`, Open Graph y Twitter Card a partir de
  los datos ya cargados por TanStack Query, más JSON-LD (`Product`+`Offer` en fichas de café,
  `Review` cuando hay reseñas, `BreadcrumbList` en todas las rutas jerárquicas, `Article` en el
  Journal). Cubre correctamente a Google/Bing.
- **Nivel 2 — `sitemap.xml` y `robots.txt` servidos por el backend** (`com.norda.seo.SeoController`,
  no por el SPA): ambos archivos son estáticos por naturaleza y no necesitan ejecutar JS para
  ser útiles, así que se generan en el backend, que es la única fuente de verdad de qué slugs
  de producto/origen/artículo existen realmente (evita un sitemap desincronizado del catálogo).
  En producción, el host estático del frontend debe reenviar `/sitemap.xml` y `/robots.txt` al
  backend (ver `frontend/public/_redirects`, con el equivalente documentado para Vercel en
  `deploy.md`), porque los buscadores los buscan en el dominio raíz del sitio, no en el de la
  API.

**Lo que se deja fuera, a propósito**: no se implementa prerenderizado real (SSG con
`vite-react-ssg`/`react-snap`, o SSR) en esta fase. Añadirlo habría acoplado el build del
frontend a que el backend esté vivo y accesible durante el build (para poder enumerar todos los
slugs a prerenderizar), lo cual es un coste operacional real que no está justificado para un
proyecto de portfolio con búsqueda de bajo volumen. Es una limitación conocida y documentada,
no un descuido: las vistas previas en redes sociales de `/coffee/*`, `/origins/*` y `/journal/*`
mostrarán el Open Graph genérico de `index.html` hasta que se implemente el nivel 2 real.

## Consecuencias
- Los crawlers de buscadores indexan cada ruta con metadata específica y correcta.
- Las tarjetas de vista previa en redes sociales NO reflejan el contenido específico de cada
  página (limitación conocida, no oculta).
- `sitemap.xml`/`robots.txt` siempre reflejan el catálogo real (generados desde la base de
  datos, no mantenidos a mano), pero requieren una regla de reenvío a nivel de host estático
  en producción — sin ella, esas rutas devuelven el `index.html` del SPA en lugar de XML/texto.
- Camino de mejora futura, si el SEO se vuelve crítico: migrar a `vite-react-ssg` (mínimo
  cambio de código, prerenderiza sobre el mismo router) o a un framework SSR (Next.js/Astro),
  aceptando entonces el runtime de servidor que ADR-001 descartó deliberadamente.
