# ADR-003: PostgreSQL como base de datos

## Estado
Aceptado

## Contexto
El dominio de NØRDA es fuertemente relacional: un producto pertenece a un país, una región, un
productor y una finca; un pedido tiene líneas con snapshots desnormalizados; el inventario debe
reservarse de forma atómica bajo concurrencia (dos clientes comprando el último paquete del
mismo café a la vez); los cupones tienen reglas de validez con fechas, mínimos de compra y
límites de uso por usuario. Todo esto exige transacciones ACID reales y constraints declarativos
(claves foráneas, `UNIQUE`, `NOT NULL`) que el propio motor haga cumplir, no solo la capa de
aplicación.

## Decisión
Se usa PostgreSQL 16 como única base de datos, tanto en desarrollo (instalación local o
contenedor Docker opcional) como en producción (servicio gestionado: Render, Railway, Neon,
Supabase...). El esquema se versiona íntegramente con Flyway (`V1__...` a `V10__...` en el
momento de escribir esto), sin generación automática de esquema en ningún entorno.

La reserva de stock durante el checkout se implementa con actualizaciones `UPDATE ... WHERE`
condicionales a nivel de fila (`InventoryRepository.tryReserve`), apoyándose en el aislamiento
de transacciones de Postgres para que dos reservas concurrentes sobre el mismo `ProductVariant`
nunca dejen el stock en negativo, sin necesidad de bloqueos explícitos (`SELECT ... FOR UPDATE`)
ni de una cola externa.

Motivos concretos frente a alternativas consideradas:
- **Frente a MySQL/MariaDB**: el soporte de Postgres para tipos de datos más ricos (arrays,
  JSONB si hiciera falta en el futuro) y su implementación de aislamiento de transacciones más
  predecible bajo concurrencia hacen que encaje mejor con el patrón de reserva atómica descrito
  arriba.
- **Frente a una base de datos NoSQL (MongoDB, DynamoDB)**: el dominio es relacional por
  naturaleza (jerarquía de orígenes, integridad referencial entre pedidos/inventario/cupones);
  modelarlo sin JOINs ni constraints reales habría trasladado esa integridad a la capa de
  aplicación, con más superficie para bugs de consistencia.

## Consecuencias
- Cualquier proveedor de Postgres gestionado sirve en producción sin cambios de código: solo
  cambia `DATABASE_URL`/`DATABASE_USERNAME`/`DATABASE_PASSWORD`.
- Los tests de integración (`AbstractIntegrationTest`) levantan un Postgres real vía
  Testcontainers en lugar de una base de datos en memoria (H2): se prueba contra el motor real
  que corre en producción, incluyendo el comportamiento exacto de `tryReserve` bajo concurrencia.
- El equipo de desarrollo necesita Postgres instalado (o Docker) incluso en local; no hay modo
  "sin base de datos" para desarrollar, algo aceptado conscientemente dado lo central que es la
  integridad relacional en este dominio.
