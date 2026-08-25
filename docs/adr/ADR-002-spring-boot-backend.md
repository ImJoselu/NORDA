# ADR-002: Spring Boot como backend

## Estado
Aceptado

## Contexto
NØRDA necesita un backend que sea la única fuente de verdad de precio, stock, descuentos, rol
de usuario y estado de pago (sección 61: la lógica crítica nunca puede vivir solo en el
frontend), con transacciones reales (reserva de inventario atómica en el checkout, sección 28),
seguridad robusta (JWT, RBAC) y que pueda desplegarse como un proceso independiente y
autocontenido —un JAR ejecutable con `java -jar`— sin depender de una plataforma serverless ni
de Docker (ver la corrección explícita de arquitectura recibida tras la Fase 1).

## Decisión
Se usa Spring Boot 3.3.5 sobre Java 21, con Spring Data JPA + Hibernate para persistencia,
Spring Security para autenticación/autorización, Spring Validation para DTOs de entrada, y
Flyway para migraciones versionadas. El build produce un único JAR ejecutable
(`spring-boot-maven-plugin`) que embebe Tomcat: no hace falta un servidor de aplicaciones
externo, solo un JDK 21 en la máquina de destino.

Motivos concretos frente a alternativas consideradas:
- **Frente a un framework más ligero (Javalin, Micronaut, Quarkus)**: Spring Security y Spring
  Data JPA cubren de forma madura y bien documentada exactamente los dos problemas más
  delicados de este dominio —autenticación con JWT + refresh cookie (ADR-008) y mapeo objeto-
  relacional de un esquema con más de 20 entidades relacionadas—, sin tener que construir esa
  infraestructura a mano. El coste de arranque en frío (JVM + Spring context) es aceptable para
  una API que corre como proceso persistente, no como función serverless.
- **Frente a Node/Express o NestJS**: se prefiere un lenguaje fuertemente tipado de extremo a
  extremo del backend (Java) con un ORM maduro para modelar relaciones complejas (Country →
  Region → Producer → Farm → Product → ProductVariant → Inventory) con validación en tiempo de
  compilación de las relaciones JPA, frente a construir ese mismo grafo a mano con un ORM de
  Node.

## Consecuencias
- El backend es un único artefacto (`norda-backend.jar`) desplegable igual en Render, Railway,
  Fly.io o cualquier VPS con JDK 21, sin pasos de build específicos de plataforma.
- `open-in-view: false` (ver `application.yml`) fuerza a que toda relación lazy se resuelva
  dentro de la capa de servicio, nunca en la vista/serialización — evita el antipatrón N+1
  oculto y hace explícitas las decisiones de fetch.
- `ddl-auto: validate` significa que Hibernate nunca modifica el esquema por sí solo: Flyway es
  la única fuente de verdad de la estructura de la base de datos, en desarrollo y en producción.
