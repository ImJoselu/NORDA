# API Reference

Referencia de todos los endpoints HTTP reales expuestos por `norda-backend` (Spring Boot 3.3.5 /
Java 21). Generado leyendo directamente los `@RestController`, los DTOs `record` y
`SecurityConfig` — si el código cambia, este documento puede quedar desactualizado hasta que se
revise de nuevo.

## Convenciones generales

- **Base URL**: `{VITE_API_URL}` — en desarrollo local, `http://localhost:8080/api` (el backend
  corre en el puerto `8080`; `sitemap.xml`, `robots.txt` y `/actuator/health` cuelgan de la raíz
  sin prefijo `/api`, el resto de rutas de este documento sí lo llevan).
- **Formato**: todas las peticiones y respuestas son JSON (`application/json`), salvo
  `GET /sitemap.xml` (`application/xml`) y `GET /robots.txt` (`text/plain`).
- **Autenticación**: Bearer JWT en la cabecera `Authorization: Bearer <accessToken>`. El
  `accessToken` se obtiene en la respuesta de `POST /api/auth/login`, `POST /api/auth/register` o
  `POST /api/auth/refresh` (`AuthResponse.accessToken`), es HS256, expira en
  `AuthResponse.expiresIn` segundos (15 minutos / 900s por defecto) y vive solo en memoria en el
  cliente. Aparte, cada una de esas tres respuestas fija una cookie `norda_refresh`
  (`httpOnly; Secure; SameSite=None; Path=/api/auth`) que **solo** usa `POST /api/auth/refresh`
  para emitir un nuevo access token — no se envía ni se lee en ningún otro endpoint.
- **Reglas de autorización** (de `SecurityConfig.authorizeHttpRequests`, en este orden):
  - Públicas: `/api/auth/**`, `/actuator/health`, `/actuator/info`, `/sitemap.xml`, `/robots.txt`,
    todo `GET /api/products/**`, `GET /api/origins/**`, `GET /api/journal/**`,
    `POST /api/recommendations/finder`, `POST /api/webhooks/**`.
  - `/api/admin/**` → `hasRole("ADMIN")`.
  - Cualquier otra ruta → `authenticated()` (cualquier rol autenticado).
  - Sin token en una ruta protegida → **401**. Token válido pero rol insuficiente → **403**.
- **Formato de error**: único para toda la API (`com.norda.common.web.ApiError`, servido por el
  `@RestControllerAdvice` global `GlobalExceptionHandler`). Nunca incluye stack traces ni detalles
  internos.

  ```json
  {
    "timestamp": "2026-08-25T10:15:30Z",
    "status": 400,
    "code": "VALIDATION_ERROR",
    "message": "email: must be a well-formed email address",
    "path": "/api/auth/register"
  }
  ```

  `code` es `VALIDATION_ERROR` para fallos de Bean Validation (`@Valid`, mensaje = campo + motivo,
  varios errores unidos con `; `), `MALFORMED_REQUEST` para JSON ilegible o parámetros con el tipo
  equivocado, `INTERNAL_ERROR` para cualquier excepción no controlada (500), y el nombre del
  `HttpStatus` (p. ej. `NOT_FOUND`, `CONFLICT`, `FORBIDDEN`) para cualquier
  `ResponseStatusException` lanzada explícitamente desde un servicio — `message` es entonces el
  texto en español pensado para mostrarse tal cual al usuario.
- Los enums Java viajan como su nombre en mayúsculas (p. ej. `RoastLevel: LIGHT|MEDIUM|MEDIUM_DARK|DARK`);
  se listan los valores reales bajo cada DTO donde son relevantes.

---

## Auth

Base: `/api/auth`. Todo público.

### `POST /api/auth/register`
Público.

Crea una cuenta con rol `CUSTOMER`, envía email de bienvenida y devuelve tokens (login implícito).

**Request:** `{ email: string, password: string (8-72), firstName: string (≤100), lastName: string (≤100) }`

**Response:** `AuthResponse` — `{ accessToken, tokenType: "Bearer", expiresIn: long (segundos), user: UserSummaryResponse }`. `UserSummaryResponse = { id, email, firstName, lastName, roles: Set<string> }`. Además fija la cookie `norda_refresh`.

**Status:** 201 Created · **Errores:** 409 si el email ya está registrado ("Ese email ya esta registrado.")

### `POST /api/auth/login`
Público.

**Request:** `{ email: string, password: string }`

**Response:** `AuthResponse` (igual que register) + cookie `norda_refresh`.

**Errores:** 401 si el email no existe, el usuario está deshabilitado o la contraseña no coincide ("Email o contrasena incorrectos.")

### `POST /api/auth/refresh`
Público (se autentica por la cookie `norda_refresh`, no por header).

Revoca el refresh token usado y emite un par de tokens nuevo (rotación en cada uso).

**Request:** sin body; lee la cookie `norda_refresh`.

**Response:** `AuthResponse` + nueva cookie `norda_refresh`.

**Errores:** 401 si falta la cookie, el hash no existe, o el token está caducado/revocado ("Sesion invalida o caducada.")

### `POST /api/auth/logout`
Público.

Revoca el refresh token (si existe) y limpia la cookie.

**Request:** sin body; lee la cookie `norda_refresh` (opcional).

**Response:** 204 sin contenido, con `Set-Cookie` que borra `norda_refresh`.

### `POST /api/auth/password/forgot`
Público.

Genera un token de reseteo (TTL 60 min) y envía un email con el enlace — **siempre** devuelve el mismo mensaje exista o no el email, para evitar enumeración de usuarios.

**Request:** `{ email: string }`

**Response:** `{ message: string }` (mensaje genérico fijo)

### `POST /api/auth/password/reset`
Público.

Cambia la contraseña usando el token del email y revoca **todos** los refresh tokens del usuario (cierra todas las sesiones).

**Request:** `{ token: string, newPassword: string (8-72) }`

**Response:** `{ message: string }`

**Errores:** 400 si el token no existe, ya se usó o caducó ("El enlace no es valido o ha caducado.")

### `POST /api/auth/password/change`
Requiere autenticación.

**Request:** `{ currentPassword: string, newPassword: string (8-72) }`

**Response:** `{ message: string }`

**Errores:** 404 si el usuario no existe · 400 si `currentPassword` no coincide ("La contrasena actual no es correcta.")

---

## Users

### `GET /api/users/me`
Requiere autenticación.

**Response:** `UserSummaryResponse` — `{ id, email, firstName, lastName, roles }`

**Errores:** 404 si el usuario del token ya no existe en base de datos ("Usuario no encontrado")

---

## Products (catálogo público)

Base: `/api/products`. Todo `GET` es público (regla explícita en `SecurityConfig`).

### `GET /api/products`
Público.

Lista paginada con filtros de catálogo. Solo incluye productos con `status = ACTIVE`.

**Query params:** `country, region, producer, variety` (strings/slugs) · `process: Process` · `roast: RoastLevel` · `method: BrewMethod` · `minAltitude, maxAltitude, minAcidity, maxAcidity, minBody, maxBody: int` · `minPriceCents, maxPriceCents: long` · `q: string` (búsqueda de texto) · `sort: ProductSort` (`RECOMMENDED|NEWEST|PRICE_ASC|PRICE_DESC`, por defecto `RECOMMENDED`) · `page` (def. 0) · `size` (def. 20, tope real 60)

**Response:** `PageResponse<ProductSummaryResponse>` — `{ content: ProductSummaryResponse[], page, size, totalElements, totalPages }`. `ProductSummaryResponse = { id, sku, name, slug, shortDescription, countryName, countrySlug, regionName, regionSlug, roastLevel, process, tastingNotes: string[], acidity, body, sweetness, priceFromCents, status }`

### `GET /api/products/featured`
Público. Hasta 6 productos activos, más recientes primero. **Response:** `ProductSummaryResponse[]`

### `GET /api/products/{slug}`
Público.

**Response:** `ProductDetailResponse` — `{ id, sku, name, slug, shortDescription, longDescription, origin: OriginSummary, variety, process, altitudeM, roastLevel, tastingNotes: string[], acidity, body, sweetness, recommendedMethods: BrewMethod[], lot: LotSummary|null, variants: ProductVariantResponse[] }`.
`OriginSummary = { countryName, countrySlug, regionName, regionSlug, producerName, producerSlug, farmName, farmSlug }` · `LotSummary = { code, harvestDate, roastDate }` · `ProductVariantResponse = { id, weightGrams, grind: Grind, priceCents, availability: string ("IN_STOCK"|"LOW_STOCK"|"OUT_OF_STOCK") }`

**Errores:** 404 si no existe un producto `ACTIVE` con ese slug ("Cafe no encontrado.")

---

## Origins (países/regiones/productores/fincas)

Base: `/api/origins`. Todo `GET` es público.

### `GET /api/origins`
Público. Árbol completo agrupado por continente.

**Response:** `ContinentGroup[]` — `{ continent: string, countries: CountrySummary[] }`. `CountrySummary = { name, slug, latitude, longitude, productCount }`

### `GET /api/origins/{country}`
Público.

**Response:** `CountryDetailResponse` — `{ name, slug, continent, description, latitude, longitude, stats: OriginStats, regions: RegionSummary[], relatedProducts: ProductSummaryResponse[] }`. `OriginStats = { altitudeMinM, altitudeMaxM, commonProcesses: string[], avgAcidity, avgBody, avgSweetness, topRegions: string[] }` · `RegionSummary = { name, slug, latitude, longitude, producerCount, productCount }`

**Errores:** 404 si el slug de país no existe ("Pais no encontrado.")

### `GET /api/origins/{country}/{region}`
Público.

**Response:** `RegionDetailResponse` — `{ name, slug, description, latitude, longitude, country: CountryRef, producers: ProducerSummary[], products: ProductSummaryResponse[] }`. `CountryRef = { name, slug }` · `ProducerSummary = { name, slug, description, farms: FarmSummary[] }` · `FarmSummary = { name, slug, altitudeM }`

**Errores:** 404 si la región no existe, o existe pero no pertenece al `{country}` de la ruta ("Region no encontrada.")

---

## Cart

Base: `/api/cart`. Todo requiere autenticación (carrito por usuario, no por sesión anónima).

### `GET /api/cart`
Requiere autenticación. Si el usuario no tiene carrito aún, devuelve un `CartResponse` vacío (no 404).

**Response:** `CartResponse` — `{ items: CartItemResponse[], itemCount, subtotalCents, couponCode: string|null, discountCents, totalCents }`. `CartItemResponse = { id, productVariantId, productName, productSlug, weightGrams, grind: Grind, unitPriceCents, quantity, lineTotalCents, availability: string }`

### `POST /api/cart/items`
Requiere autenticación. Crea el carrito si no existe. Si la variante ya está en el carrito, suma la cantidad (tope 20 por línea).

**Request:** `{ productVariantId: UUID, quantity: int (1-20) }`

**Response:** `CartResponse`

**Errores:** 404 si la variante no existe ("Variante no encontrada.")

### `PATCH /api/cart/items/{itemId}`
Requiere autenticación. Fija la cantidad absoluta de una línea (tope 20).

**Request:** `{ quantity: int (1-20) }`

**Response:** `CartResponse`

**Errores:** 404 si no hay carrito o la línea no pertenece al carrito del usuario ("El artículo no está en tu carrito.")

### `DELETE /api/cart/items/{itemId}`
Requiere autenticación.

**Response:** `CartResponse`

**Errores:** 404 igual que el PATCH anterior

### `DELETE /api/cart`
Requiere autenticación. Vacía todas las líneas (no falla si no hay carrito).

**Response:** 204 sin contenido

### `POST /api/cart/coupon`
Requiere autenticación.

Aplica un cupón al carrito del usuario. Vuelve a validar el cupón contra el subtotal actual del carrito.

**Request:** `{ code: string }`

**Response:** `CartResponse` (items, itemCount, subtotalCents, couponCode, discountCents, totalCents)

**Errores:** 404 si no hay carrito ("No tienes un carrito activo.") · 404 si el cupón no existe ("Ese cupón no existe.") · 400 si no está vigente, no alcanza el mínimo de compra, o ya fue usado por este usuario

### `DELETE /api/cart/coupon`
Requiere autenticación. Quita el cupón aplicado (si había uno).

**Response:** `CartResponse`

**Errores:** 404 si no hay carrito activo

---

## Coupons

No existe un `CouponController` público independiente: los clientes aplican/quitan cupones solo a través de `POST /api/cart/coupon` y `DELETE /api/cart/coupon` (arriba). La gestión de cupones (crear, listar, editar, borrar) vive en **Admin → Coupons** más abajo, y la misma validación (`CouponService.validateForUser`: vigencia, mínimo de compra, un uso por usuario) se reejecuta al aplicar el cupón en el carrito y de nuevo al confirmar el checkout.

---

## Checkout & Orders

Rutas sueltas (sin `@RequestMapping` de clase): `/api/checkout` y `/api/orders/**`. Todo requiere autenticación.

### `POST /api/checkout`
Requiere autenticación.

Transacción única: reserva stock, calcula IVA/envío/descuento, crea el pedido, cobra vía `PaymentService` y confirma o libera stock según el resultado. Si el carrito tenía cupón aplicado, se revalida y se registra su uso.

**Request:** `CheckoutRequest = { shippingAddress: ShippingAddress, shippingMethod: ShippingMethod }`. `ShippingAddress = { fullName, line1, line2 (opcional), city, region, postalCode, country, phone }` (todos obligatorios salvo `line2`) · `ShippingMethod = STANDARD|EXPRESS|PICKUP`

**Response:** `OrderResponse` — `{ id, orderNumber, status: OrderStatus, shippingAddress, shippingMethod, subtotalCents, shippingCents, discountCents, taxCents, totalCents, items: OrderItemResponse[], createdAt }`. `OrderItemResponse = { productVariantId, productName, weightGrams, grind, unitPriceCents, quantity, lineTotalCents }`. `OrderStatus = PENDING|PAID|PROCESSING|SHIPPED|DELIVERED|CANCELLED|REFUNDED`

**Status:** 201 Created · **Errores:** 400 si el carrito no existe o está vacío ("Tu carrito está vacío.") · 409 si no hay stock suficiente de alguna línea ("No hay stock suficiente de {producto}.") · 402 Payment Required si el cobro falla ("No se pudo procesar el pago." — el pedido queda `CANCELLED` y el stock reservado se libera)

### `GET /api/orders`
Requiere autenticación. Pedidos del usuario autenticado, más recientes primero.

**Response:** `OrderSummaryResponse[]` — `{ id, orderNumber, status, totalCents, itemCount, createdAt }`

### `GET /api/orders/{orderId}`
Requiere autenticación. Solo el dueño del pedido puede verlo (`findByIdAndUserId`, nunca `findById` a secas).

**Response:** `OrderResponse`

**Errores:** 404 si no existe o no pertenece al usuario ("Pedido no encontrado.")

### `POST /api/orders/{orderId}/reorder`
Requiere autenticación. Vuelve a añadir al carrito los artículos de un pedido pasado, usando el precio **actual** de cada variante (no el histórico del pedido). Ignora en silencio las variantes que ya no existen.

**Response:** `CartResponse`

**Errores:** 404 si el pedido no existe o no es del usuario

---

## Reviews

Base: `/api/products/{slug}/reviews`.

### `GET /api/products/{slug}/reviews`
Público (hereda la regla `GET /api/products/**`). Solo reseñas con `status = VISIBLE`.

**Response:** `ProductReviewsResponse` — `{ averageRating: double, reviewCount: long, reviews: ReviewResponse[] }`. `ReviewResponse = { id, authorName, rating, title, comment, createdAt }` (`authorName` = nombre + inicial del apellido, p. ej. "Ana G.")

**Errores:** 404 si el producto no existe/no está activo ("Café no encontrado.")

### `POST /api/products/{slug}/reviews`
Requiere autenticación. Solo puede reseñar quien tenga un pedido con esa variante de producto en estado `PAID`, `PROCESSING`, `SHIPPED` o `DELIVERED`, y solo una reseña por producto y usuario.

**Request:** `{ rating: int (1-5), title: string (≤150), comment: string (≤2000) }`

**Response:** `ReviewResponse`

**Status:** 201 Created · **Errores:** 404 producto no encontrado · 409 si ya reseñó ese café ("Ya has escrito una reseña para este café.") · 403 si no lo ha comprado ("Solo puedes reseñar cafés que hayas comprado.")

---

## Favorites

Base: `/api/favorites`. Todo requiere autenticación.

### `GET /api/favorites`
Requiere autenticación. **Response:** `ProductSummaryResponse[]` (favoritos del usuario, más recientes primero; se descartan productos que ya no existen)

### `POST /api/favorites/{productId}`
Requiere autenticación. Idempotente (si ya es favorito, no hace nada y responde igual).

**Response:** 204 sin contenido · **Errores:** 404 si el producto no existe ("Café no encontrado.")

### `DELETE /api/favorites/{productId}`
Requiere autenticación. No falla si no era favorito. **Response:** 204 sin contenido

---

## Subscriptions

Base: `/api/subscriptions`. Todo requiere autenticación.

`SubscriptionFrequency = TWO_WEEKS|ONE_MONTH|SIX_WEEKS|TWO_MONTHS` · `SubscriptionType = FIXED|SURPRISE|ORIGIN_DISCOVERY` · `SubscriptionStatus = ACTIVE|PAUSED|CANCELLED`

### `GET /api/subscriptions`
Requiere autenticación. **Response:** `SubscriptionResponse[]`. `SubscriptionResponse = { id, status, coffeeCount, frequency, type, originCountryName: string|null, nextDeliveryDate, items: { productId, productName, productSlug }[] }`

### `POST /api/subscriptions`
Requiere autenticación.

**Request:** `CreateSubscriptionRequest = { coffeeCount: int (1-2), frequency: SubscriptionFrequency, type: SubscriptionType, fixedProductIds: UUID[]|null, originCountrySlug: string|null }`. `fixedProductIds` solo se usa (y se exige) cuando `type = FIXED`; `originCountrySlug` solo cuando `type = ORIGIN_DISCOVERY`.

**Response:** `SubscriptionResponse`

**Status:** 201 Created · **Errores:** 400 si `type = ORIGIN_DISCOVERY` y falta o no existe el país ("Selecciona un país de origen válido.") · 400 si `type = FIXED` y `fixedProductIds` no tiene exactamente `coffeeCount` elementos ("Elige exactamente N café(s) fijo(s).") o alguno no existe ("Alguno de los cafés seleccionados no existe.")

### `PATCH /api/subscriptions/{id}`
Requiere autenticación. Mismo body que la creación (`CreateSubscriptionRequest`); reemplaza items y valores.

**Response:** `SubscriptionResponse` · **Errores:** 404 si no existe o no es del usuario ("Suscripción no encontrada.") · mismas 400 que en creación

### `POST /api/subscriptions/{id}/pause` · `POST /api/subscriptions/{id}/resume` · `POST /api/subscriptions/{id}/cancel` · `POST /api/subscriptions/{id}/skip`
Requieren autenticación. Cambian el estado/próxima fecha de una suscripción propia.

**Response:** `SubscriptionResponse` en los cuatro casos · **Errores:** 404 si no existe o no es del usuario

---

## Recommendations (Coffee Finder)

### `POST /api/recommendations/finder`
Público (única ruta `POST` marcada pública explícitamente en `SecurityConfig`).

Calcula un match entre las preferencias enviadas y el catálogo activo.

**Request:** `FinderRequest = { method: BrewMethod, profiles: Set<FlavorProfile> (no vacío), body: BodyPreference, acidity: AcidityPreference, budget: BudgetRange }`. `FlavorProfile = SWEET|FRUITY|CHOCOLATE|FLORAL|CITRUS|INTENSE` · `BodyPreference = LIGHT|MEDIUM|INTENSE` · `AcidityPreference = LOW|MEDIUM|HIGH` · `BudgetRange = UNDER_15|FROM_15_TO_20|FROM_20_TO_30|OVER_30`

**Response:** `FinderResultItem[]` — `{ product: ProductSummaryResponse, matchPercent: int, explanation: string }`

---

## Journal (blog)

Base: `/api/journal`. Todo `GET` es público.

### `GET /api/journal`
Público. **Query param:** `category: BlogCategory` opcional (`GUIDES|ORIGINS|METHODS|PRODUCERS|RECIPES`)

**Response:** `BlogPostSummaryResponse[]` — `{ id, slug, title, excerpt, category, author, publishedAt, readingTimeMinutes }`, ordenado por fecha de publicación descendente

### `GET /api/journal/{slug}`
Público.

**Response:** `BlogPostDetailResponse` — igual que el summary + `content: string`

**Errores:** 404 si el slug no existe ("Artículo no encontrado.")

---

## SEO (sitemap.xml / robots.txt)

Rutas en la raíz (sin prefijo `/api`). Públicas.

### `GET /sitemap.xml`
Público. `Content-Type: application/xml`. Genera dinámicamente las URLs de páginas estáticas (`/`, `/coffee`, `/origins`, `/journal`, `/finder`), todos los productos `ACTIVE` (`/coffee/{slug}`), todos los países y regiones (`/origins/{country}[/{region}]`) y todos los posts del journal (`/journal/{slug}`), usando `FRONTEND_URL` como dominio base.

### `GET /robots.txt`
Público. `Content-Type: text/plain`. `Allow: /` salvo `/account`, `/checkout`, `/admin`; referencia `{FRONTEND_URL}/sitemap.xml`.

---

## Admin

Base `/api/admin/**` (salvo Origins, ver abajo). **Todo requiere rol `ADMIN`** (`hasRole("ADMIN")` en `SecurityConfig`; una petición autenticada sin ese rol responde 403).

### Dashboard

#### `GET /api/admin/dashboard`
Requiere rol ADMIN. Todas las métricas se agregan en memoria sobre pedidos con estado `PAID/PROCESSING/SHIPPED/DELIVERED`.

**Response:** `DashboardResponse` — `{ totalRevenueCents, totalOrders, totalCustomers, averageOrderValueCents, lowStockCount, activeSubscriptions, recurringCustomers (clientes con ≥2 pedidos pagados), salesLast14Days: DailySales[], topProducts: TopProduct[], topCountries: TopCountry[] }`. `DailySales = { date: string (ISO), revenueCents, orderCount }` (14 días incl. hoy) · `TopProduct = { name, unitsSold, revenueCents }` (top 5 por unidades) · `TopCountry = { countryCode, orderCount }` (top 5, según `Order.shippingCountry`)

### Products

#### `GET /api/admin/products`
Requiere rol ADMIN. Todos los productos, cualquier estado. **Response:** `ProductSummaryResponse[]`

#### `GET /api/admin/products/{id}`
Requiere rol ADMIN.

**Response:** `AdminProductDetailResponse` — espejo editable de `Product`: `{ id, sku, slug, name, shortDescription, longDescription, countryId, regionId, producerId, farmId, variety, process, altitudeM, roastLevel, tastingNotes, acidity, body, sweetness, recommendedMethods, status, basePriceCents }`

**Errores:** 404 si no existe ("Café no encontrado.")

#### `POST /api/admin/products`
Requiere rol ADMIN. Al crear, genera automáticamente 3 variantes en grano (250g/500g/1000g, precio = `basePriceCents × 1.0/1.9/3.6` redondeado a 10 céntimos) con inventario inicial `stock=0, minStock=5`.

**Request:** `AdminProductRequest = { sku, slug, name, shortDescription, longDescription, countryId: UUID, regionId: UUID, producerId: UUID, farmId: UUID, variety, process: Process, altitudeM: int (>0), roastLevel: RoastLevel, tastingNotes: string[] (no vacío), acidity/body/sweetness: int (1-5), recommendedMethods: Set<BrewMethod> (no vacío), status: ProductStatus, basePriceCents: long (>0) }`. `sku` y `slug` no llevan `@NotBlank` en el DTO pero se validan a mano en el servicio.

**Response:** `ProductSummaryResponse`

**Status:** 201 Created · **Errores:** 400 si falta `sku` o `slug` ("SKU y slug son obligatorios al crear un café.") · 409 si el slug ya existe ("Ya existe un café con ese slug.") · 400 si `countryId/regionId/producerId/farmId` no resuelven a una entidad existente ("País/Región/Productor/Finca no válido/a.")

#### `PUT /api/admin/products/{id}`
Requiere rol ADMIN. Mismo `AdminProductRequest`, pero **`sku` y `slug` se ignoran**: son inmutables tras la creación (identifican URLs y referencias externas), así que enviarlos no tiene efecto.

**Response:** `ProductSummaryResponse` · **Errores:** 404 si no existe · 400 si algún id de origen no resuelve

#### `POST /api/admin/products/{id}/archive` · `POST /api/admin/products/{id}/activate`
Requiere rol ADMIN. Cambian `status` a `ARCHIVED`/`ACTIVE` respectivamente.

**Response:** `ProductSummaryResponse` · **Errores:** 404 si no existe

### Orders

#### `GET /api/admin/orders`
Requiere rol ADMIN. **Query param:** `status: OrderStatus` opcional.

**Response:** `AdminOrderResponse[]` — `{ id, orderNumber, status, customerName, customerEmail, totalCents, itemCount, createdAt }` (`customerName`/`customerEmail` = "—" si el usuario ya no existe)

#### `GET /api/admin/orders/{id}`
Requiere rol ADMIN. **Response:** `OrderResponse` (mismo shape que el endpoint de cliente, sin filtrar por dueño) · **Errores:** 404 ("Pedido no encontrado.")

#### `PATCH /api/admin/orders/{id}/status`
Requiere rol ADMIN. Solo permite transiciones válidas de `OrderStatus` (máquina de estados: `PENDING→{PAID,CANCELLED}`, `PAID→{PROCESSING,CANCELLED,REFUNDED}`, `PROCESSING→{SHIPPED,CANCELLED}`, `SHIPPED→{DELIVERED,REFUNDED}`, `DELIVERED→{REFUNDED}`; `CANCELLED`/`REFUNDED` son finales). Si el pedido venía de un estado con stock ya descontado (`PAID/PROCESSING/SHIPPED/DELIVERED`) y pasa a `CANCELLED`/`REFUNDED`, repone el stock de cada línea.

**Request:** `{ status: OrderStatus }`

**Response:** `OrderResponse` · **Errores:** 404 si no existe · 400 si la transición no está permitida ("No se puede pasar de {actual} a {nuevo}.")

### Customers

#### `GET /api/admin/customers`
Requiere rol ADMIN. Un pedido cuenta para el gasto total solo si su pago se completó (`PAID/PROCESSING/SHIPPED/DELIVERED`).

**Response:** `AdminCustomerResponse[]` — `{ id, name, email, orderCount, totalSpentCents, lastOrderAt: Instant|null, hasActiveSubscription, createdAt }`, ordenado por gasto total descendente

### Inventory

#### `GET /api/admin/inventory`
Requiere rol ADMIN. **Query param:** `lowStockOnly: boolean` (def. `false`; filtra `status != IN_STOCK`).

**Response:** `AdminInventoryResponse[]` — `{ productVariantId, productId, productName, sku, weightGrams, grind, stock, reserved, available, minStock, status: InventoryStatus }`. `InventoryStatus = IN_STOCK|LOW_STOCK|OUT_OF_STOCK`. Ordenado por nombre de producto.

#### `PUT /api/admin/inventory/{variantId}`
Requiere rol ADMIN.

**Request:** `{ stock: int (≥0), minStock: int (≥0) }`

**Response:** `AdminInventoryResponse` · **Errores:** 404 si la variante o su registro de inventario no existen ("Variante no encontrada." / "Inventario no encontrado.")

### Origins

Nota: estas rutas **no** cuelgan de `/api/admin/origins`, sino directamente de `/api/admin/countries`, `/api/admin/regions`, `/api/admin/producers`, `/api/admin/farms` (sin `@RequestMapping` de clase en `AdminOriginController`) — pero siguen bajo `hasRole("ADMIN")` por el patrón `/api/admin/**`. Productores y fincas son **solo lectura** desde el admin (por diseño: su gestión completa con lotes no se implementó).

#### `GET /api/admin/countries`
Requiere rol ADMIN. **Response:** `AdminCountryResponse[]` — `{ id, name, slug, continent: Continent, description, latitude, longitude, typicalAltitudeMinM, typicalAltitudeMaxM }`. `Continent = AFRICA|AMERICA|ASIA`

#### `POST /api/admin/countries`
Requiere rol ADMIN.

**Request:** `AdminCountryRequest = { name, slug, continent: Continent, description, latitude, longitude, typicalAltitudeMinM, typicalAltitudeMaxM }` (`slug`/`continent` solo se usan al crear)

**Response:** `AdminCountryResponse` · **Errores:** 400 si falta `slug` o `continent` · 409 si el slug ya existe ("Ya existe un pais con ese slug.")

#### `PUT /api/admin/countries/{id}`
Requiere rol ADMIN. `slug` y `continent` del body se ignoran (identidad inmutable tras crear); solo actualiza nombre/descripción/coordenadas/altitud típica.

**Response:** `AdminCountryResponse` · **Errores:** 404 ("Pais no encontrado.")

#### `GET /api/admin/regions`
Requiere rol ADMIN. **Query param:** `countryId: UUID` opcional. **Response:** `AdminRegionResponse[]` — `{ id, name, slug, countryId, countryName, description, latitude, longitude }`

#### `POST /api/admin/regions`
Requiere rol ADMIN.

**Request:** `AdminRegionRequest = { name, slug, countryId: string, description, latitude, longitude }` — nótese que `countryId` aquí es `String`, no `UUID` (ver Notas).

**Response:** `AdminRegionResponse` · **Errores:** 400 si falta `slug` o `countryId` · 409 si el slug ya existe ("Ya existe una region con ese slug.") · 400 si `countryId` no resuelve a un país ("Pais no encontrado.")

#### `PUT /api/admin/regions/{id}`
Requiere rol ADMIN. `slug`/`countryId` se ignoran; solo actualiza nombre/descripción/coordenadas.

**Response:** `AdminRegionResponse` · **Errores:** 404 ("Region no encontrada.")

#### `GET /api/admin/producers`
Requiere rol ADMIN. Solo lectura. **Query param:** `regionId: UUID` opcional. **Response:** `AdminProducerResponse[]` — `{ id, name, slug, regionId, regionName, description }`

#### `GET /api/admin/farms`
Requiere rol ADMIN. Solo lectura. **Query param:** `producerId: UUID` opcional. **Response:** `AdminFarmResponse[]` — `{ id, name, slug, producerId, producerName, altitudeM }`

### Reviews

Base: `/api/admin/reviews`.

#### `GET /api/admin/reviews`
Requiere rol ADMIN. Todas las reseñas, cualquier estado. **Response:** `AdminReviewResponse[]` — `{ id, productId, productName, customerName, rating, title, comment, status: ReviewStatus, createdAt }`. `ReviewStatus = VISIBLE|HIDDEN`

#### `POST /api/admin/reviews/{id}/hide`
Requiere rol ADMIN. Pasa `status` a `HIDDEN` (deja de aparecer en `GET /api/products/{slug}/reviews`). **Response:** 200 sin cuerpo · **Errores:** 404 ("Reseña no encontrada.")

#### `POST /api/admin/reviews/{id}/restore`
Requiere rol ADMIN. Pasa `status` a `VISIBLE`. **Response:** 200 sin cuerpo · **Errores:** 404

### Coupons

Base: `/api/admin/coupons`.

#### `GET /api/admin/coupons`
Requiere rol ADMIN. **Response:** `CouponResponse[]` — `{ id, code, type: CouponType, value: long, startsAt, expiresAt, minPurchaseCents, maxUses, usedCount, active }`. `CouponType = PERCENTAGE|FIXED`

#### `POST /api/admin/coupons`
Requiere rol ADMIN.

**Request:** `AdminCouponRequest = { code, type: CouponType, value: long (>0), startsAt, expiresAt, minPurchaseCents: Long|null, maxUses: Integer|null, active: boolean }`

**Response:** `CouponResponse` · **Status:** 201 Created · **Errores:** 409 si ya existe un cupón con ese código ("Ya existe un cupón con ese código.")

#### `PUT /api/admin/coupons/{id}`
Requiere rol ADMIN. Mismo `AdminCouponRequest` (el `code` del body no se usa para renombrar; solo actualiza tipo/valor/vigencia/mínimo/usos/activo).

**Response:** `CouponResponse` · **Errores:** 404 ("Cupón no encontrado.")

#### `DELETE /api/admin/coupons/{id}`
Requiere rol ADMIN. **Response:** 204 sin contenido (no valida existencia antes de borrar)

---

## Webhooks

### `POST /api/webhooks/stripe`
Público (autenticado por firma de Stripe, no por sesión — `SecurityConfig` permite explícitamente todo `POST /api/webhooks/**`).

Preparado para cuando se active un `PaymentService` real con Stripe (hoy el checkout usa `DemoPaymentService` síncrono, así que este endpoint no recibe tráfico real). Verifica la cabecera `Stripe-Signature` contra `STRIPE_WEBHOOK_SECRET`; si esa variable no está configurada, responde 200 e ignora el payload (modo demo). Procesa `payment_intent.succeeded` (marca el pago y el pedido como pagados) y `payment_intent.payment_failed` (marca el pago fallido y el pedido `CANCELLED`); registra en log otros tipos de evento (`checkout.session.completed`, eventos de `customer.subscription.*`) sin actuar sobre ellos.

**Request:** payload raw de Stripe (string) + cabecera `Stripe-Signature`

**Response:** 200 sin cuerpo en todos los casos manejados

**Errores:** 400 si la firma no es válida y el secreto sí está configurado

---

## Notas

- **`AdminRegionRequest.countryId` es `String`, no `UUID`** (a diferencia de `AdminRegionResponse.countryId`, que sí es `UUID`). Un valor que no sea un UUID válido devuelve un 400 informativo ("El identificador del pais no es válido.") — `AdminOriginService.createRegion` envuelve el `UUID.fromString(...)` en su propio try/catch para eso. El tipo del campo sigue siendo `String` en el DTO (no `UUID`), así que la validación de formato es responsabilidad explícita del servicio, no del binding de Jackson.
- **`AdminProductRequest.sku`/`.slug` se validan solo en `POST` y se ignoran en `PUT`**: el método `Product.update(...)` deliberadamente no acepta esos dos campos (son inmutables tras crear, comentario explícito en `Product.java`), pero el DTO de request es el mismo para crear y editar, así que un cliente que reenvíe el `AdminProductDetailResponse` completo al hacer `PUT` no notará que esos dos campos no se aplican.
- **`availability` en `ProductVariantResponse` y `CartItemResponse` es un `String` libre**, no un enum tipado en el DTO — en la práctica siempre es uno de `IN_STOCK`/`LOW_STOCK`/`OUT_OF_STOCK` (el nombre de `InventoryStatus`, o `"OUT_OF_STOCK"` a mano si no hay fila de inventario), pero el tipo del campo no lo garantiza en tiempo de compilación para el cliente.
