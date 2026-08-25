# Decisiones de arquitectura

Índice de las Architecture Decision Records completas (razonamiento, alternativas consideradas
y consecuencias) en [`adr/`](adr), más las decisiones menores que no justifican una ADR propia
pero que conviene dejar explícitas para quien lea el código por primera vez.

## ADRs

| ADR | Decisión |
|---|---|
| [001](adr/ADR-001-frontend-react-vite.md) | React + TypeScript + Vite como SPA de cliente, sin SSR/framework full-stack |
| [002](adr/ADR-002-spring-boot-backend.md) | Spring Boot 3 / Java 21 como backend, desplegable como JAR autocontenido |
| [003](adr/ADR-003-postgresql.md) | PostgreSQL como única base de datos, en local y en producción |
| [004](adr/ADR-004-payment-abstraction.md) | `PaymentService` como puerto de dominio; `DemoPaymentService` activo, Stripe real preparado pero no implementado |
| [005](adr/ADR-005-recommendation-engine.md) | Motor de recomendación determinista por reglas para el Coffee Finder, no ML |
| [006](adr/ADR-006-map-provider.md) | Leaflet + OpenStreetMap para el Origin Map, sin clave de API |
| [007](adr/ADR-007-seo-prerendering.md) | Meta tags dinámicos client-side + sitemap/robots generados en backend, sin SSR/SSG |
| [008](adr/ADR-008-jwt-refresh-cookie.md) | Access token JWT en memoria + refresh token opaco en cookie httpOnly |

## Decisiones menores

Elegidas por el mismo criterio que rige el resto del proyecto (sección 60 del brief: preferir 10
funcionalidades excelentes a 50 mediocres, evitar dependencias innecesarias), documentadas aquí
en vez de en una ADR propia porque son de alcance más local:

- **`OriginArt` (arte abstracto determinista por seed) en vez de fotografía de producto**: no hay
  fotografía real con licencia verificada disponible para 20-30 productos y 8 artículos del
  Journal. Un generador de composiciones SVG deterministas (mismo seed → misma imagen siempre)
  evita tanto imágenes rotas como el placeholder gris genérico, y mantiene una identidad visual
  coherente con la paleta editorial del proyecto.
- **`MarkdownLite` propio en vez de una librería de markdown**: el contenido del Journal solo
  necesita encabezados `##`/`###` y párrafos — el subconjunto real que generan los artículos. Una
  librería completa (remark, marked...) traería un parser de tablas, listas anidadas, HTML
  embebido y demás que no se usan en ningún artículo real, a cambio de un componente de ~20
  líneas.
- **Gráficos del panel admin como SVG hechos a mano, no una librería de charting**: el dashboard
  necesita una única visualización (barras de ventas de 14 días). Añadir Chart.js/Recharts para
  un solo gráfico habría sido la dependencia innecesaria que la sección 60 del brief pide evitar
  explícitamente.
- **UUID como clave primaria en toda tabla, nunca autoincremental**: evita filtrar volumen de
  negocio (cuántos pedidos/usuarios existen) a través de la secuencia de un ID visible en una URL
  pública (`/account/orders/{id}`, `/coffee/{slug}` usa slug pero las APIs internas exponen UUID).
- **Agregaciones del dashboard admin en memoria, no vía SQL `GROUP BY`**: a la escala de un
  portfolio (cientos de pedidos, no millones), traer los pedidos pagados y agregarlos en Java es
  más simple de leer y mantener que un conjunto de consultas SQL especializadas, sin coste de
  rendimiento perceptible. Documentado explícitamente en el código
  (`AdminDashboardService`) como una decisión consciente de escala, no un descuido.
