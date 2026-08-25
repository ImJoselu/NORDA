# ADR-008: JWT de acceso en memoria + refresh token en cookie httpOnly

## Estado
Aceptado

## Contexto
NØRDA necesita autenticación real (sección 20 del brief), sin depender de `localStorage` como
mecanismo de autorización, y con el backend como única fuente de verdad sobre roles y sesión.

## Decisión
- **Access token**: JWT firmado (HS256), vida corta (15 min por defecto), devuelto en el body
  de la respuesta y guardado únicamente **en memoria** en el frontend (Zustand, nunca en
  `localStorage`/`sessionStorage`). Se envía en `Authorization: Bearer`.
- **Refresh token**: valor opaco (no JWT) de 256 bits, **solo se persiste su hash SHA-256** en
  la tabla `refresh_tokens`. Se entrega en una cookie `httpOnly`, `Secure`, `SameSite=None`,
  con `Path=/api/auth`. `POST /api/auth/refresh` lo rota (revoca el anterior, emite uno nuevo).
- El JWT es autocontenido: `JwtAuthenticationFilter` no consulta la base de datos en cada
  petición, construye la autenticación directamente desde los claims (`sub`, `roles`).
- CSRF queda deshabilitado a nivel de Spring Security. `SameSite=None` es obligatorio (no
  `Strict` ni `Lax`) porque frontend (Vercel/Netlify) y backend (Render/Railway/Fly.io) viven en
  dominios distintos en producción: un cookie `Strict`/`Lax` nunca llegaría a `/api/auth/refresh`
  en una petición `fetch` entre dominios, ni siquiera desde el propio frontend legítimo.
  La mitigación real de CSRF aquí es la lista blanca de CORS: un origen ajeno puede disparar la
  petición (la cookie viaja) pero el navegador le bloquea la lectura de la respuesta JSON y del
  `Set-Cookie`, así que como mucho fuerza una rotación de sesión, nunca una fuga del token.
- Un reseteo de contraseña revoca todos los refresh tokens activos del usuario.

## Alternativas consideradas
- **Sesión de servidor (cookie de sesión + Spring Session)**: descartada por añadir estado
  compartido (Redis u otro store) que no aporta valor en esta fase y complica el despliegue
  serverless/PaaS del backend.
- **JWT también en localStorage**: descartada explícitamente por el brief (vulnerable a robo de
  token vía XSS); de ahí que el access token viva solo en memoria y el refresh token en cookie
  httpOnly (inaccesible a JavaScript).

## Consecuencias
- El usuario pierde la sesión "activa" (access token en memoria) al recargar la pestaña, pero se
  restaura de forma transparente en el arranque de la app llamando a `/api/auth/refresh` con la
  cookie httpOnly (ver `frontend/src/app/useAuthBootstrap.ts`).
- Revocar una sesión (logout, reset de contraseña) es una operación real en base de datos, no un
  simple "olvidar el token" del lado del cliente.
