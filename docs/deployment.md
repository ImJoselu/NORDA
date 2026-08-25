# Despliegue

Guía general, independiente de proveedor. Para pasos concretos con un proveedor real elegido
(dominio, comandos exactos, valores reales), ver `deploy.md` en la raíz del repositorio — no se
versiona en git (contiene detalles ligados a la infraestructura real desplegada, ver
`.gitignore`) y se genera al final del proyecto, después de que exista un despliegue real que
documentar.

## Principio general

Backend y frontend se despliegan por separado y de forma independiente (ver
[ADR-001](adr/ADR-001-frontend-react-vite.md) y [ADR-002](adr/ADR-002-spring-boot-backend.md)):
no existe un único "build de producción" combinado, ni Docker es necesario para ninguno de los
dos. Se comunican únicamente vía HTTP, a través de `VITE_API_URL`.

## Backend

**Requisitos**: JDK 21 y una base de datos PostgreSQL 16 accesible (local, en un contenedor, o un
servicio gestionado).

**Build**:
```bash
cd backend
./mvnw clean package -DskipTests
# genera target/norda-backend.jar
```

**Ejecución**:
```bash
java -jar target/norda-backend.jar
```

Al arrancar, Flyway aplica automáticamente cualquier migración pendiente contra la base de datos
configurada — no hay un paso de migración manual separado. `ddl-auto: validate` significa que si
el esquema real no coincide con lo que las entidades esperan, el arranque falla de forma
explícita en vez de modificar el esquema silenciosamente.

**Variables de entorno obligatorias en producción** (ver `backend/.env.example` para la lista
completa con comentarios): `SPRING_PROFILES_ACTIVE=prod`, `DATABASE_URL`, `DATABASE_USERNAME`,
`DATABASE_PASSWORD`, `JWT_SECRET` (generar uno propio, p. ej. `openssl rand -base64 48` — nunca
reutilizar el valor de desarrollo), `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`. `STRIPE_SECRET_KEY`
y `STRIPE_WEBHOOK_SECRET` son opcionales mientras `DemoPaymentService` sea la implementación
activa (ver [ADR-004](adr/ADR-004-payment-abstraction.md)).

**Verificación de salud**: `GET /actuator/health` responde `{"status":"UP"}` sin detalle interno
(`show-details: never`) — es el endpoint que cualquier plataforma PaaS debería usar como health
check para saber cuándo el proceso está listo para recibir tráfico.

**Dockerfile opcional**: `backend/Dockerfile` construye la misma imagen que el JAR anterior, para
plataformas que prefieran desplegar como contenedor. No es la única vía ni la recomendada por
defecto — ver el comentario al inicio del propio archivo.

## Frontend

**Requisitos**: Node.js 20+.

**Build**:
```bash
cd frontend
npm ci
npm run build
# genera frontend/dist/, un sitio 100% estático
```

`frontend/dist/` se sirve desde cualquier host de estáticos (Vercel, Netlify, Cloudflare Pages,
un bucket S3 + CDN...). No hay servidor Node en producción para el frontend.

**Variable de entorno obligatoria**: `VITE_API_URL` (la URL pública del backend, con `/api` al
final — p. ej. `https://api.tudominio.com/api`). Al ser una variable `VITE_`, se resuelve **en
tiempo de build**, no en tiempo de ejecución: hay que configurarla en la plataforma de hosting
*antes* de ejecutar `npm run build`, no después.

**`sitemap.xml` y `robots.txt`**: estos dos archivos los genera el backend, no el build del
frontend (ver [ADR-007](adr/ADR-007-seo-prerendering.md)) — el host estático debe reenviar
`/sitemap.xml` y `/robots.txt` al dominio del backend. Ver `frontend/public/_redirects` para el
formato (funciona tal cual en Netlify/Cloudflare Pages; en Vercel el equivalente son
`rewrites` en `vercel.json`).

## Orden recomendado de despliegue inicial

1. Aprovisionar PostgreSQL (gestionado o propio) y anotar su cadena de conexión.
2. Desplegar el backend con las variables de entorno anteriores; confirmar `GET /actuator/health`
   y que las migraciones de Flyway se aplicaron (log de arranque: `Migrating schema "public" to
   version "10 - blog posts"` o la última migración existente).
3. Desplegar el frontend con `VITE_API_URL` apuntando al backend ya desplegado.
4. Configurar `CORS_ALLOWED_ORIGINS` en el backend con el dominio real del frontend (y
   `FRONTEND_URL` para los enlaces de los emails transaccionales).
5. Configurar el reenvío de `/sitemap.xml` y `/robots.txt` en el host del frontend.
6. Promocionar el primer usuario ADMIN por acceso directo a la base de datos (no existe un
   endpoint público para esto, es deliberado — ver `docs/security.md`).

## Docker Compose (opcional, para desarrollo)

`docker-compose.yml` en la raíz levanta Postgres y el backend en contenedores para quien prefiera
no instalar Postgres localmente. No representa la topología de producción (en producción, backend
y frontend son procesos/despliegues completamente independientes, normalmente en proveedores
distintos) — es exclusivamente una comodidad de desarrollo local.
