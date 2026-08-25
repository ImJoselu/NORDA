# ADR-001: React + TypeScript + Vite como frontend

## Estado
Aceptado

## Contexto
NØRDA necesita un frontend interactivo (carrito, wizard del Coffee Finder, mapa de orígenes,
panel admin) que además debe ser indexable por buscadores en sus páginas de catálogo y
contenido editorial, y desplegable como sitio estático en plataformas como Vercel, Netlify o
Cloudflare Pages sin infraestructura de servidor propia.

## Decisión
Se usa React 18 + TypeScript + Vite como SPA de cliente, sin framework full-stack (se descarta
Next.js/Remix para no acoplar el proyecto a un runtime de servidor Node en producción). La
compilación de producción (`npm run build`) genera assets estáticos servibles desde cualquier
CDN.

## Consecuencias
- El SEO de las rutas indexables (`/coffee/*`, `/origins/*`, `/journal/*`) requiere una
  estrategia explícita de prerenderizado, ya que una SPA pura no expone HTML poblado a los
  crawlers en la primera respuesta (ver decisión relacionada, pendiente de ADR cuando se
  implemente en la fase de SEO).
- El despliegue del frontend es independiente del backend: puede vivir en un host de estáticos
  mientras el backend vive en Render/Railway/Fly.io, comunicados vía `VITE_API_URL`.
