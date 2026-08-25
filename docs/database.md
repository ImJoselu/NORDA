# Base de datos

PostgreSQL 16 (ver [ADR-003](adr/ADR-003-postgresql.md)). El esquema se versiona íntegramente
con Flyway; no hay generación automática de esquema en ningún entorno (`ddl-auto: validate`).

## Migraciones

| Migración | Contenido |
|---|---|
| `V1__init.sql` | Extensión `pgcrypto` (para `gen_random_uuid()`), tabla `users` base |
| `V2__auth.sql` | Roles (`user_roles`), refresh tokens, tokens de reseteo de contraseña |
| `V3__catalog.sql` | `countries`, `regions`, `producers`, `farms`, `coffee_lots`, `products`, `product_variants`, `inventory` |
| `V4__seed_data.sql` | 9 países, sus regiones/productores/fincas, y 20-30 cafés con datos coherentes (sección 45) |
| `V5__cart_favorites.sql` | `carts`, `cart_items`, `favorites` |
| `V6__orders.sql` | `orders`, `order_items`, `payments` |
| `V7__reviews.sql` | `reviews` |
| `V8__subscriptions.sql` | `subscriptions`, `subscription_items` |
| `V9__coupons.sql` | `coupons`, `coupon_usages`, columna `coupon_code` en `carts` |
| `V10__blog_posts.sql` | `blog_posts`, con los 8 artículos del Journal |

## Jerarquía de origen

```
Country (continente, coordenadas, altitud típica)
  └─ Region (coordenadas)
       └─ Producer
            └─ Farm (altitud)
                 └─ CoffeeLot (cosecha/tueste de un lote concreto)
```

`Product` referencia los cuatro niveles directamente (`country_id`, `region_id`, `producer_id`,
`farm_id`), no solo la finca — evita tener que subir la cadena de JOINs para filtrar el catálogo
por país o región, que son los dos niveles de navegación más usados en `/coffee` y `/origins`.

## Catálogo e inventario

- **`Product`** nunca almacena precio ni stock: esos datos viven en `ProductVariant` (una fila
  por combinación peso × molienda) e `Inventory` (1:1 con la variante). `Product.basePriceCents`
  es la única excepción deliberada — un precio de referencia denormalizado para poder ordenar y
  mostrar "desde X€" en el listado sin unir con `product_variants`.
- **`Inventory`** guarda `stock` y `reserved` por separado; `available = stock - reserved` se
  calcula, nunca se persiste. La reserva atómica durante el checkout usa un `UPDATE` condicional
  a nivel de fila (`InventoryRepository.tryReserve`), no un `SELECT` seguido de un `UPDATE`, para
  eliminar la condición de carrera entre dos compras simultáneas del mismo producto.

## Pedidos: snapshots deliberados

`Order` y `OrderItem` desnormalizan a propósito varios campos que ya existen en otras tablas:

- La dirección de envío se copia entera en columnas propias de `Order`
  (`shipping_full_name`, `shipping_line1`, ...) en vez de referenciar una tabla `addresses`: si
  el usuario edita o borra una dirección guardada más tarde, el historial de pedidos no debe
  cambiar retroactivamente.
- `OrderItem` copia `product_name`, `weight_grams`, `grind` y `unit_price_cents` en el momento de
  la compra, en vez de solo guardar `product_variant_id`: el precio o el nombre de un producto
  pueden cambiar después sin alterar lo que el pedido histórico realmente mostró y cobró.
- `OrderItem.position` fija el orden de las líneas explícitamente (columna propia, no
  `@OrderColumn` de JPA — ver nota de implementación en el código) porque `@OrderColumn` sobre una
  relación bidireccional `mappedBy` no rellena la columna de forma fiable al insertar.

## Cupones

`Coupon` guarda `type` (`PERCENTAGE`/`FIXED`), `value`, ventana de validez opcional
(`starts_at`/`expires_at`), compra mínima opcional y límite de usos opcional. `CouponUsage`
registra cada aplicación exitosa (cupón + usuario + pedido) y es la fuente de verdad para la
regla "un usuario no puede usar el mismo cupón dos veces" — se comprueba con un `EXISTS` contra
esta tabla, no con un contador en `Coupon`.

## Suscripciones

`Subscription` representa una suscripción activa/pausada/cancelada con frecuencia
(`ONE_MONTH`/`TWO_MONTHS`/`THREE_MONTHS`) y tipo (`FIXED` con productos concretos vía
`subscription_items`, `SURPRISE` sin selección, o `ORIGIN_DISCOVERY` ligada a un país vía
`origin_country_id`).

## Reseñas y Journal

`Review` es única por (`product_id`, `user_id`) a nivel de aplicación (ver `docs/security.md`
para la regla de negocio exacta: solo puede reseñar quien compró el producto). `BlogPost` no
tiene tabla de categorías propia — `category` es un enum de 5 valores fijos (`GUIDES`,
`ORIGINS`, `METHODS`, `PRODUCERS`, `RECIPES`), suficiente para el volumen de contenido actual sin
necesitar una tabla de taxonomía completa.

## Convenciones

- Toda clave primaria es `UUID` generada con `gen_random_uuid()` (Postgres) o
  `GenerationType.UUID` (Hibernate del lado de la entidad al insertar programáticamente) — nunca
  IDs autoincrementales, para no filtrar volumen de negocio (número de pedidos, usuarios...) por
  la simple secuencia de un ID en una URL pública.
- Todas las tablas con ciclo de vida editable tienen `created_at`/`updated_at` en `TIMESTAMPTZ`,
  gestionados por callbacks `@PrePersist`/`@PreUpdate` de JPA, nunca por el cliente.
- Los DTOs de la API nunca exponen entidades JPA directamente (sección 44): cada respuesta se
  mapea explícitamente a un `record` propio en un paquete `dto`, incluso cuando el mapeo es
  campo-a-campo, para que la forma de la API no cambie accidentalmente si cambia una entidad.
