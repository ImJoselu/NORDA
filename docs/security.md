# Seguridad

## Autenticación

Ver [ADR-008](adr/ADR-008-jwt-refresh-cookie.md) para el razonamiento completo. Resumen
operativo:

- Contraseñas: hash con BCrypt (`BCryptPasswordEncoder`, factor de coste 10 por defecto de
  Spring Security). Nunca se almacena ni se loguea la contraseña en claro en ningún punto.
- Access token: JWT HS256, 15 minutos de vida, firmado con `JWT_SECRET` (variable de entorno,
  nunca hardcodeado — sección 56). Va en `Authorization: Bearer` y vive solo en memoria en el
  frontend (Zustand), nunca en `localStorage`.
- Refresh token: valor aleatorio opaco de 256 bits, **solo se persiste su hash SHA-256** en
  `refresh_tokens` — si la base de datos se filtrara, no expondría tokens de sesión utilizables
  directamente. Viaja en una cookie `httpOnly; Secure; SameSite=None; Path=/api/auth`, se rota
  (revoca + reemite) en cada uso, y un reseteo de contraseña revoca todos los refresh tokens
  activos del usuario.
- `JwtAuthenticationFilter` no consulta la base de datos en cada petición autenticada: reconstruye
  la identidad y los roles directamente desde los claims del JWT, firmados y por tanto
  no falsificables sin conocer `JWT_SECRET`.

## Autorización (RBAC)

Dos roles: `CUSTOMER` (por defecto al registrarse) y `ADMIN` (nunca asignable desde un endpoint
público — se promociona por acceso directo a base de datos, deliberadamente fuera del alcance de
la API HTTP). `SecurityConfig` aplica las reglas a nivel de ruta:

| Ruta | Regla |
|---|---|
| `/api/auth/**` | pública |
| `GET /api/products/**`, `GET /api/origins/**`, `GET /api/journal/**` | pública |
| `POST /api/recommendations/finder` | pública |
| `POST /api/webhooks/**` | pública (autenticada por firma, no por sesión — ver más abajo) |
| `/sitemap.xml`, `/robots.txt`, `/actuator/health`, `/actuator/info` | pública |
| `/api/admin/**` | `hasRole("ADMIN")` |
| cualquier otra ruta | requiere autenticación (cualquier rol) |

Una petición sin token a una ruta protegida responde **401** (`RestAuthenticationEntryPoint`);
una petición autenticada pero sin el rol requerido responde **403**
(`RestAccessDeniedHandler`) — la distinción importa porque confirma o no si el token es válido,
sin filtrar más información de la necesaria.

Además de la protección por ruta, hay reglas de propiedad a nivel de dato que la capa de
autorización HTTP no puede expresar por sí sola y que cada servicio comprueba explícitamente:
un pedido solo lo puede consultar su propio dueño (`OrderRepository.findByIdAndUserId`, nunca
`findById` a secas en un endpoint de cliente), y solo puede reseñar un producto quien tenga un
pedido pagado que lo incluya (`ReviewService.hasPurchased`).

## Validación de entrada

Todos los DTOs de request son `record` de Java anotados con Bean Validation
(`@NotBlank`, `@Email`, `@Positive`, `@Valid` en cascada para objetos anidados como
`ShippingAddress`). Un fallo de validación responde 400 con el campo y el motivo, gestionado por
un `@RestControllerAdvice` global — nunca se procesa una petición con datos incompletos o del
tipo incorrecto antes de llegar a la capa de servicio.

## Inyección SQL

Toda consulta pasa por Spring Data JPA (métodos derivados del nombre o `@Query` con parámetros
nombrados/posicionales, nunca concatenación de strings). No hay ningún punto del código que
construya SQL a partir de texto de entrada del usuario.

## XSS

React escapa por defecto todo lo que se renderiza como texto; el proyecto no usa
`dangerouslySetInnerHTML` en ningún componente. El contenido del Journal (`BlogPost.content`) se
renderiza con un parser propio y deliberadamente mínimo (`MarkdownLite`) que solo reconoce
encabezados `##`/`###` y párrafos como texto plano — no interpreta HTML embebido, así que no hay
superficie de inyección aunque el contenido viniera de una fuente menos confiable en el futuro.

## CORS y CSRF

CORS usa lista blanca explícita (`CORS_ALLOWED_ORIGINS`, variable de entorno — nunca `*` en
producción). CSRF está deshabilitado a nivel de Spring Security porque la única superficie
autenticada por cookie es `/api/auth/refresh`, y el propio origen de esa cookie
(`SameSite=None` + lista blanca de CORS) es la mitigación real: un origen no autorizado puede
disparar la petición pero el navegador le impide leer la respuesta. El detalle completo del
trade-off está en [ADR-008](adr/ADR-008-jwt-refresh-cookie.md).

## Pagos

El checkout nunca toca ni almacena datos de tarjeta: `DemoPaymentService` es la implementación
activa (modo portfolio, sección 25) y `POST /api/webhooks/stripe` ya verifica la firma real de
Stripe (`Stripe.Webhook.constructEvent` con `STRIPE_WEBHOOK_SECRET`) aunque hoy no reciba tráfico
real. Detalle completo en [ADR-004](adr/ADR-004-payment-abstraction.md).

## Cabeceras y manejo de errores

- `server.error.include-message: never` e `include-stacktrace: never` en producción
  (`application.yml`): un 500 nunca filtra un mensaje de excepción interno ni una traza al
  cliente.
- `management.endpoint.health.show-details: never`: el endpoint de salud confirma que el proceso
  responde, sin exponer detalles de la base de datos subyacente ni de otros componentes.
- Los errores de negocio (`ResponseStatusException`) sí devuelven un mensaje pensado para
  mostrarse al usuario (en español, sin detalle técnico interno) — ver `docs/api.md` para el
  formato exacto del cuerpo de error.

## Límites conocidos (no implementados)

Documentados aquí explícitamente en vez de silenciados, siguiendo la misma política de
honestidad que las demás ADRs:

- **Sin rate limiting**: no hay límite de intentos en `/api/auth/login` ni en la creación de
  cupones/reseñas. En un despliegue con tráfico real, un proxy inverso (Cloudflare, o una
  librería como Bucket4j delante del filtro de autenticación) debería añadirse antes de exponer
  el backend públicamente sin restricciones de red.
- **Sin 2FA**: fuera del alcance de un proyecto de portfolio; el modelo de autenticación soporta
  añadirlo sin rediseño (un paso adicional entre `validar contraseña` y `emitir tokens`).
