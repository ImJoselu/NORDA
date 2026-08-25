ACTÚA COMO UN EQUIPO SENIOR COMPLETO FORMADO POR:

- Senior Software Architect
- Senior Full-Stack Engineer
- Senior Java Backend Engineer
- Senior React/TypeScript Engineer
- Senior UI/UX Designer
- Senior Product Designer
- Senior Database Engineer
- Senior DevOps Engineer
- Senior QA Engineer
- Senior SEO Engineer
- Senior E-commerce Architect
- Technical Product Manager

Tu misión es diseñar y construir DESDE CERO una aplicación web full-stack profesional llamada:

# NØRDA

TAGLINE:

"Descubre el café detrás de cada origen."

==================================================
1. OBJETIVO DEL PROYECTO
==================================================

NØRDA será principalmente un proyecto de PORTFOLIO.

NO quiero una simple demo CRUD.

NO quiero una landing page bonita con datos falsos.

NO quiero una tienda genérica.

Quiero construir un producto que, visualmente y técnicamente, parezca una empresa real y que pueda evolucionar posteriormente hasta convertirse en un ecommerce real.

El objetivo principal es demostrar ante recruiters y potenciales clientes que sé construir un producto full-stack completo.

Debe demostrar especialmente:

- Arquitectura
- Backend Java/Spring
- Frontend React/TypeScript
- UX/UI
- Base de datos
- Seguridad
- Autenticación
- Autorización
- REST API
- Ecommerce
- Sistema de recomendaciones
- Catálogo
- Geolocalización/origen
- Checkout
- Inventario
- Pedidos
- Suscripciones
- Administración
- Analytics
- SEO
- Testing
- Docker
- Integraciones externas
- Responsive design
- Buenas prácticas de ingeniería

==================================================
2. PRIORIDADES DEL PRODUCTO
==================================================

Prioridad 1:

DISCOVER COFFEE

El elemento diferenciador principal de NØRDA debe ser descubrir café por:

- continente
- país
- región
- productor
- finca
- variedad
- proceso
- altitud
- tueste
- perfil de sabor
- método de preparación

Prioridad 2:

COFFEE FINDER

El usuario debe poder responder unas preguntas y recibir recomendaciones personalizadas.

Prioridad 3:

ORIGIN MAP

El usuario debe poder explorar visualmente de dónde procede el café.

Debe poder navegar por:

Mundo
→ Continente
→ País
→ Región
→ Productor/Finca
→ Café

Prioridad 4:

ECOMMERCE

Carrito
Productos
Checkout
Pedidos
Cupones
Inventario
Favoritos
Reviews

Prioridad 5:

ADMIN PANEL

Debe parecer una herramienta empresarial real y seria.

==================================================
3. STACK DEFINITIVO
==================================================

FRONTEND:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zod
- React Hook Form
- Zustand cuando aporte valor

BACKEND:

- Java 21+
- Spring Boot 3+
- Spring Security
- Spring Data JPA
- Hibernate
- Bean Validation
- Maven
- PostgreSQL
- Flyway

TESTING:

Backend:
- JUnit 5
- Mockito
- Spring Boot Test
- Testcontainers

Frontend:
- Vitest
- React Testing Library

E2E:
- Playwright

INFRA:

- Docker
- Docker Compose
- Git
- GitHub-ready structure

PAGOS:

Stripe preparado para producción.

En portfolio:

MODO DEMO

NO realizar cobros reales.

Debe existir una abstracción que permita pasar posteriormente a Stripe real sin reescribir la lógica del dominio.

EMAIL:

Crear:

EmailService

con implementación:

MockEmailService

y arquitectura preparada para:

Resend
SendGrid
SMTP

MAPAS:

Utilizar una solución realista como:

Leaflet + OpenStreetMap

o equivalente.

==================================================
4. ARQUITECTURA GENERAL
==================================================

Arquitectura:

React
↓
REST API
↓
Spring Boot
↓
PostgreSQL

Servicios externos:

Stripe
Email provider
Map provider
Storage provider

El código debe estar preparado para sustituir proveedores externos.

No acoplar el dominio a Stripe, Leaflet, Resend, etc.

Ejemplo:

PaymentService
StripePaymentService

EmailService
MockEmailService
ResendEmailService

StorageService
LocalStorageService
CloudStorageService

==================================================
5. ARQUITECTURA BACKEND
==================================================

Utilizar arquitectura modular orientada a dominio.

Estructura aproximada:

backend/
└── src/main/java/com/norda/
    ├── auth/
    ├── user/
    ├── product/
    ├── catalog/
    ├── origin/
    ├── country/
    ├── region/
    ├── producer/
    ├── inventory/
    ├── cart/
    ├── order/
    ├── payment/
    ├── subscription/
    ├── coupon/
    ├── review/
    ├── favorite/
    ├── recommendation/
    ├── shipping/
    ├── notification/
    ├── blog/
    ├── admin/
    └── common/

Cada módulo deberá separar cuando tenga sentido:

- controller
- service
- repository
- domain
- dto
- mapper

No utilizar arquitectura artificialmente compleja.

No crear clases únicamente para "parecer enterprise".

==================================================
6. FRONTEND
==================================================

Crear una aplicación React profesional.

Estructura aproximada:

frontend/
└── src/
    ├── app/
    ├── components/
    ├── layouts/
    ├── pages/
    ├── features/
    ├── hooks/
    ├── services/
    ├── store/
    ├── types/
    ├── utils/
    ├── config/
    ├── assets/
    └── data/

Utilizar componentes reutilizables.

Evitar:

- componentes gigantes
- lógica de negocio dentro del JSX
- llamadas API dispersas
- estado global innecesario

==================================================
7. DISEÑO VISUAL
==================================================

El diseño es PRIORIDAD MÁXIMA.

Quiero una experiencia:

- premium
- minimalista
- editorial
- elegante
- moderna
- Apple-like
- cinematográfica
- sofisticada

NO quiero:

- aspecto Bootstrap
- ecommerce genérico
- cards repetitivas sin personalidad
- exceso de sombras
- exceso de gradientes
- exceso de animaciones
- interfaz saturada

Inspiración conceptual:

Apple
Aesop
Nespresso premium
Specialty coffee brands
Editorial design

Pero NO copiar ninguna marca.

Crear identidad visual propia.

==================================================
8. DESIGN SYSTEM
==================================================

Crear un pequeño Design System.

Definir:

- colores
- spacing
- typography
- border radius
- shadows
- buttons
- inputs
- cards
- badges
- modal
- toast
- dropdown
- tabs
- skeleton
- loading states
- empty states
- error states

La interfaz debe ser consistente.

==================================================
9. HOME
==================================================

La homepage debe vender la EXPERIENCIA de descubrir café.

Hero:

"El café no empieza en tu taza."

"Empieza en su origen."

CTA:

EXPLORAR CAFÉS

CTA:

DESCUBRIR MI CAFÉ

Mostrar fotografía de producto/origen muy grande.

Después:

CAFÉS DESTACADOS

4-6 productos.

Después:

EXPLORE THE ORIGINS

Mapa del mundo interactivo.

Mostrar visualmente:

África
América
Asia

Después:

DISCOVER YOUR COFFEE

Coffee Finder.

Después:

NØRDA EXPLORER

"Un nuevo origen cada mes."

Después:

EDITORIAL

Artículos.

==================================================
10. ORIGIN EXPERIENCE
==================================================

Esta funcionalidad debe ser una de las estrellas de NØRDA.

Crear un mapa interactivo.

El usuario podrá seleccionar:

África
América
Asia

Después:

Colombia

Después:

Huila

Y visualizar:

- ubicación
- región
- altitud
- productores
- cafés
- características del café

El mapa debe ser visual, elegante y útil.

No debe ser simplemente "un mapa con pins".

==================================================
11. PÁGINA DE PAÍS
==================================================

Ejemplo:

/origins/colombia

Mostrar:

COLOMBIA

"Hogar de algunos de los cafés más reconocidos del mundo."

Secciones:

- mapa
- regiones
- productores
- características
- proceso
- variedades
- métodos
- cafés relacionados

Mostrar estadísticas visuales:

Altitud típica
Procesos comunes
Perfil habitual
Principales regiones

==================================================
12. PÁGINA DE REGIÓN
==================================================

Ejemplo:

/origins/colombia/huila

Mostrar:

HUILA

Mapa.

Productores.

Fincas.

Cafés.

Historia.

Perfil típico.

==================================================
13. PRODUCT DETAIL
==================================================

Ruta:

/coffee/{slug}

Esta página debe ser uno de los apartados visualmente más impresionantes.

Mostrar:

- galería
- país
- región
- productor
- finca
- variedad
- proceso
- altitud
- cosecha
- fecha de tueste
- notas de cata
- tueste
- acidez
- cuerpo
- dulzor
- métodos recomendados

Mostrar visualmente:

Acidez 3/5
Cuerpo 4/5
Dulzor 5/5

No utilizar únicamente números.

Utilizar elementos visuales elegantes.

==================================================
14. FORMATOS
==================================================

Permitir:

250 g
500 g
1 kg

Y:

Grano
Molido

Si selecciona molido:

Espresso
Moka
V60
French Press
Aeropress

El precio debe recalcularse.

==================================================
15. COFFEE FINDER
==================================================

Feature estrella.

Crear una experiencia tipo "wizard".

Preguntas:

1. ¿Qué método utilizas?
2. ¿Qué perfiles te gustan?
3. ¿Qué cuerpo quieres?
4. ¿Qué acidez prefieres?
5. ¿Qué presupuesto tienes?

Opciones:

Espresso
V60
Moka
French Press
Aeropress

Dulce
Frutal
Chocolate
Floral
Cítrico
Intenso

Ligero
Medio
Intenso

Baja
Media
Alta

<15
15-20
20-30
30+

Resultado:

TU CAFÉ IDEAL

Colombia Huila

92% MATCH

Después:

Etiopía Yirgacheffe
87%

Guatemala Antigua
81%

Mostrar EXPLICACIÓN:

"Te recomendamos Colombia Huila porque buscas..."

Esta explicación es importante.

No mostrar únicamente un porcentaje.

==================================================
16. MOTOR DE RECOMENDACIÓN
==================================================

Implementar inicialmente un motor determinista basado en reglas.

Crear:

RecommendationEngine

El algoritmo debe analizar:

- método
- perfil
- cuerpo
- acidez
- precio

Posteriormente preparado para:

- comportamiento
- historial
- compras
- favoritos
- reviews

NO utilizar IA ficticia.

Si posteriormente se añade IA:

debe ser una extensión del sistema, no una dependencia.

==================================================
17. CATÁLOGO
==================================================

Crear:

/coffee

Funciones:

- búsqueda
- filtros
- ordenación
- paginación
- favoritos
- quick add

Filtros:

País
Región
Productor
Variedad
Proceso
Altitud
Tueste
Perfil
Acidez
Cuerpo
Método
Precio

Ordenar:

Recomendados
Más vendidos
Más populares
Novedades
Precio
Valoración

==================================================
18. ECOMMERCE
==================================================

Crear ecommerce realista.

Carrito:

- añadir
- eliminar
- cantidad
- variante
- molienda

Mostrar:

Subtotal
Descuento
Envío
Impuestos
Total

==================================================
19. CUPONES
==================================================

Crear sistema completo.

Ejemplos:

NORDA10
WELCOME15

Reglas:

- porcentaje
- cantidad fija
- fechas
- mínimo de compra
- máximo de usos
- usuario
- producto
- categoría

Validar siempre en backend.

==================================================
20. AUTENTICACIÓN
==================================================

AUTH REAL.

No utilizar únicamente localStorage como sistema de autenticación.

Implementar:

Registro
Login
Logout
Refresh/session
Recuperación de contraseña
Cambio de contraseña

Utilizar:

Spring Security.

Passwords:

BCrypt o Argon2.

Preparar arquitectura segura para JWT o mecanismo de sesión adecuado.

==================================================
21. ROLES
==================================================

CUSTOMER

ADMIN

Preparar:

ROLE_ADMIN

ROLE_CUSTOMER

Nunca confiar en el frontend para autorización.

==================================================
22. CUENTA DEL USUARIO
==================================================

Crear:

/account

Secciones:

Perfil
Direcciones
Pedidos
Favoritos
Reviews
Suscripciones
Preferencias

==================================================
23. FAVORITOS
==================================================

Permitir:

Añadir
Eliminar

Crear:

/account/favorites

Recomendaciones basadas en favoritos.

==================================================
24. REVIEWS
==================================================

Solo usuarios que hayan comprado pueden escribir una review.

Campos:

Rating
Título
Comentario
Fecha

Mostrar:

★★★★★
4.8/5

Filtros.

==================================================
25. CHECKOUT
==================================================

Crear checkout profesional.

Pasos:

1. Datos
2. Dirección
3. Envío
4. Pago
5. Confirmación

En portfolio:

MODO DEMO

Simular:

PaymentIntent
Checkout

Pero la arquitectura debe ser compatible con Stripe real.

==================================================
26. STRIPE
==================================================

Crear:

PaymentService

Implementación:

StripePaymentService

Actualmente:

DemoPaymentService

Nunca guardar información de tarjeta.

Crear:

POST /api/webhooks/stripe

Validar firma.

Eventos:

checkout.session.completed
payment_intent.succeeded
payment_intent.payment_failed

Preparar suscripciones:

customer.subscription.created
customer.subscription.updated
customer.subscription.deleted

==================================================
27. SUSCRIPCIONES
==================================================

Crear:

NØRDA EXPLORER

Opciones:

1 café
2 cafés

Frecuencias:

2 semanas
1 mes
6 semanas
2 meses

Tipos:

Café fijo
Café sorpresa
Descubrimiento por origen

Acciones:

Crear
Pausar
Reanudar
Cancelar
Cambiar
Omitir próximo envío

==================================================
28. INVENTARIO
==================================================

Crear sistema realista.

Cada producto:

SKU
Stock
Stock mínimo
Reservado
Disponible

Estados:

LOW STOCK
OUT OF STOCK

Gestionar reservas de checkout.

==================================================
29. LOTES
==================================================

Crear:

CoffeeLot

Ejemplo:

COL-HUI-2026-08

Campos:

- código
- fecha entrada
- fecha tueste
- cantidad
- proveedor
- origen

Preparar trazabilidad.

==================================================
30. ADMIN PANEL
==================================================

Esta funcionalidad debe ser MUY SERIA.

Ruta:

/admin

Dashboard:

- ventas
- pedidos
- clientes
- ingresos
- ticket medio
- conversión
- productos vendidos
- top productos
- top países
- stock bajo
- suscripciones
- clientes recurrentes

Gráficas:

Ventas por día
Ventas por mes
Productos
Países
Clientes

==================================================
31. ADMIN PRODUCTS
==================================================

CRUD completo.

Campos:

SKU
Nombre
Slug
Precio
Descripción
País
Región
Productor
Finca
Variedad
Proceso
Altitud
Tueste
Notas
Stock
Imágenes
Estado

Crear / editar / eliminar / activar.

==================================================
32. ADMIN ORDERS
==================================================

Tabla empresarial.

Filtros:

Estado
Fecha
Cliente
Importe

Estados:

PENDING
PAID
PROCESSING
SHIPPED
DELIVERED
CANCELLED
REFUNDED

Permitir modificar estado.

==================================================
33. ADMIN CUSTOMERS
==================================================

Mostrar:

Cliente
Pedidos
Facturación
Última compra
Suscripción
Estado

==================================================
34. ADMIN INVENTORY
==================================================

Mostrar:

Producto
SKU
Stock
Reservado
Disponible
Stock mínimo

Alertas:

Low stock
Out of stock

==================================================
35. ADMIN COFFEE ORIGINS
==================================================

Permitir administrar:

Continente
País
Región
Productor
Finca
Lotes

Debe estar conectado con el catálogo.

==================================================
36. ADMIN REVIEWS
==================================================

Permitir:

moderar
ocultar
restaurar

Reviews.

==================================================
37. ADMIN COUPONS
==================================================

CRUD completo.

==================================================
38. BLOG / JOURNAL
==================================================

Crear:

/journal

Categorías:

Guías
Orígenes
Métodos
Productores
Recetas

Crear al menos 8 artículos demo.

NO utilizar lorem ipsum.

==================================================
39. SEO
==================================================

SEO MUY IMPORTANTE.

Crear:

title
description
canonical
Open Graph
Twitter cards
sitemap
robots

JSON-LD:

Product
Offer
Review
BreadcrumbList
Article

URLs:

/coffee/{slug}

/origins/{country}

/origins/{country}/{region}

/journal/{slug}

Las páginas de productos y orígenes deben tener metadata dinámica.

==================================================
40. RESPONSIVE
==================================================

Diseñar específicamente para:

320px
375px
768px
1024px
1440px
1920px

Mobile first.

No limitarse a encoger desktop.

Crear:

mobile navbar
drawer filters
mobile cart
bottom actions cuando aporte valor

==================================================
41. UX
==================================================

Cada interacción importante debe tener:

loading
success
error
empty
disabled

Crear:

Skeleton loaders
Toast
Modal
Confirmation dialog

Microinteracciones:

- añadir carrito
- favoritos
- transición entre páginas
- cambio de variante
- filtros
- finder
- mapa

Animaciones suaves.

No exagerar.

==================================================
42. ACCESIBILIDAD
==================================================

Implementar:

HTML semántico
ARIA cuando corresponda
Keyboard navigation
Focus states
Contraste
Alt text
Labels

==================================================
43. PERFORMANCE
==================================================

Optimizar:

- imágenes
- lazy loading
- code splitting
- queries
- bundle
- API calls
- React rendering

Utilizar TanStack Query correctamente.

==================================================
44. BASE DE DATOS
==================================================

Entidades principales:

User
Role
Address
Product
ProductVariant
Country
Region
Producer
Farm
CoffeeLot
Inventory
Cart
CartItem
Order
OrderItem
Payment
Subscription
SubscriptionItem
Coupon
CouponUsage
Review
Favorite
Recommendation
Shipping
Notification
BlogPost

Utilizar DTOs.

No exponer entidades directamente.

Evitar N+1.

==================================================
45. DATOS DEMO
==================================================

Crear mínimo:

20-30 cafés.

Países:

Colombia
Etiopía
Kenia
Brasil
Guatemala
Costa Rica
Panamá
Ruanda
Perú

Datos coherentes.

Cada producto:

- nombre
- slug
- país
- región
- productor
- finca
- variedad
- proceso
- altitud
- tueste
- notas
- acidez
- cuerpo
- dulzor
- métodos
- precio
- SKU
- stock

==================================================
46. IMÁGENES
==================================================

No usar imágenes rotas.

Utilizar una fuente configurable.

Cada imagen:

alt

Todas las imágenes deben estar relacionadas con:

- café
- productores
- regiones
- preparación
- producto

==================================================
47. EMAIL
==================================================

Crear:

EmailService

Emails:

Registro
Pedido
Pago
Envío
Entrega
Suscripción
Review
Stock

En desarrollo utilizar:

MockEmailService

==================================================
48. LOGÍSTICA
==================================================

Crear:

ShippingProvider

Métodos:

Standard
Express
Pickup

Preparar integración futura:

Correos
GLS
DHL

==================================================
49. FACTURACIÓN
==================================================

Preparar:

Invoice

Campos:

number
order
customer
date
items
subtotal
tax
total

No implementar fiscalidad avanzada.

==================================================
50. POLÍTICAS
==================================================

Crear:

Privacy
Terms
Cookies
Shipping
Refunds
FAQ
Contact

Todo coherente con la marca.

==================================================
51. SEGURIDAD
==================================================

Implementar:

- autenticación
- autorización
- validación
- CORS correctamente configurado
- passwords seguras
- manejo de errores
- rate limiting preparado
- protección de endpoints admin

Nunca confiar en:

precio frontend
stock frontend
descuento frontend
rol frontend
estado de pago frontend

==================================================
52. MANEJO DE ERRORES
==================================================

Backend:

GlobalExceptionHandler

Formato:

{
  "timestamp": "...",
  "status": 400,
  "code": "...",
  "message": "...",
  "path": "..."
}

Frontend:

errores UX-friendly.

Nunca mostrar stack traces.

==================================================
53. LOGGING
==================================================

Nunca registrar:

password
JWT
tokens
datos sensibles
tarjetas

Crear logs útiles.

==================================================
54. TESTING
==================================================

Backend:

JUnit
Mockito
Spring Boot Test
Testcontainers

Probar especialmente:

registro
login
permisos
productos
carrito
cupones
checkout
stock
pedidos
reviews
favoritos
suscripciones
admin

Frontend:

Vitest
React Testing Library

E2E:

Playwright

==================================================
55. DOCKER
==================================================

Crear:

Dockerfile backend

docker-compose.yml

Servicios:

backend
postgres

Preparar configuración para producción.

==================================================
56. CONFIGURACIÓN
==================================================

Nunca hardcodear:

database password
Stripe keys
JWT secrets
API keys

Crear:

.env.example

application-local.yml

application-prod.yml

==================================================
57. README
==================================================

Crear README profesional.

Debe explicar:

- qué es NØRDA RESUMEN RAPIDO
- Capturas
- Explica la app
- Resumen de lo que se puede hacer
- Cómo compilarla
- Cómo desplegarla en local
- Tests

El README debe parecer un proyecto real de GitHub.

==================================================
58. DOCUMENTACIÓN ARQUITECTÓNICA
==================================================

Crear:

/docs

Con:

architecture.md
database.md
api.md
security.md
deployment.md
decisions.md

Documentar decisiones importantes.

==================================================
59. ADR
==================================================

Crear Architecture Decision Records para decisiones relevantes.

Ejemplos:

ADR-001 Frontend React
ADR-002 Spring Boot
ADR-003 PostgreSQL
ADR-004 Stripe abstraction
ADR-005 Recommendation engine
ADR-006 Map provider

==================================================
60. NO HACER
==================================================

NO:

- código ficticio presentado como funcional
- endpoints inventados
- datos incoherentes
- contraseñas reales
- claves API
- lorem ipsum
- código duplicado
- archivos gigantes
- lógica de negocio dentro del JSX
- lógica crítica únicamente en frontend
- dependencias innecesarias
- arquitectura sobrecomplicada
- 50 funcionalidades superficiales

Prefiero:

10 funcionalidades excelentes

antes que:

50 funcionalidades mediocres.

==================================================
61. REGLA DE CALIDAD
==================================================

Cada feature debe cumplir:

FUNCIONALIDAD
+
DISEÑO
+
UX
+
SEGURIDAD
+
TEST
+
ARQUITECTURA

Si no se puede implementar una integración real:

crear implementación MOCK.

Pero NO dejar botones que no hagan nada.

==================================================
62. ESTRATEGIA DE IMPLEMENTACIÓN
==================================================

NO GENERES TODA LA APLICACIÓN DE GOLPE.

Quiero construirla progresivamente.

FASE 0
Arquitectura y especificación.

FASE 1
Monorepo + backend + frontend + database + Docker + design system.

FASE 2
Auth + users + roles.

FASE 3
Catálogo + productos + orígenes.

FASE 4
Origin Map + Country + Region + Producer.

FASE 5
Coffee Finder + Recommendation Engine.

FASE 6
Carrito + favoritos.

FASE 7
Checkout + órdenes + inventario.

FASE 8
Stripe abstraction + demo payments + webhooks.

FASE 9
Reviews + reorder.

FASE 10
Subscriptions.

FASE 11
Admin completo.

FASE 12
Journal + SEO.

FASE 13
Testing + performance + accessibility.

FASE 14
Docker + producción + documentación.

==================================================
63. REGLA DE CONTINUIDAD
==================================================

Cuando yo diga:

"FASE 1"

solo implementa FASE 1.

Cuando diga:

"FASE 2"

continúa sobre el estado anterior.

NO regeneres archivos que no cambian.

Para cada archivo modificado:

ARCHIVO:
ruta

CAMBIOS:
explicación breve

Después proporciona el archivo completo.

==================================================
64. VALIDACIÓN OBLIGATORIA
==================================================

Después de cada fase revisa:

- imports
- dependencias
- rutas
- endpoints
- DTOs
- nombres
- relaciones
- referencias
- configuraciones
- compatibilidad frontend/backend

Entregar:

CHECKLIST

[ ] Compila
[ ] Backend inicia
[ ] Frontend inicia
[ ] Base de datos inicia
[ ] APIs funcionan
[ ] No faltan dependencias
[ ] UX funcional
[ ] Responsive
[ ] No hay errores evidentes

==================================================
65. PRIMERA RESPUESTA
==================================================

NO escribas código todavía.

Primero responde únicamente con:

1. VISIÓN ARQUITECTÓNICA

2. STACK DEFINITIVO

3. ESTRUCTURA DEL PROYECTO

4. MODELO DE DATOS

5. ARQUITECTURA DE AUTENTICACIÓN

6. ARQUITECTURA DEL ORIGIN MAP

7. ARQUITECTURA DEL COFFEE FINDER

8. ARQUITECTURA DEL ECOMMERCE

9. ARQUITECTURA DEL ADMIN

10. API PRINCIPAL

11. SEGURIDAD

12. SEO

13. ESTRATEGIA DE TESTING

14. ROADMAP

15. RIESGOS TÉCNICOS

16. DECISIONES DE ARQUITECTURA

17. FASE 1 PROPUESTA

NO generes archivos todavía.

Después espera exactamente:

"EMPEZAR FASE 1"

==================================================
66. OBJETIVO FINAL
==================================================

Cuando NØRDA esté terminado, debe poder presentarse como:

"NØRDA es una plataforma full-stack de café de especialidad centrada en el descubrimiento de orígenes, con mapa interactivo, sistema personalizado de recomendación, ecommerce, autenticación, pagos preparados para Stripe, suscripciones, inventario, reviews, SEO y un panel administrativo empresarial."

El resultado debe demostrar claramente:

FULL-STACK ENGINEERING

y no simplemente:

"he hecho una tienda online."

Quiero que un recruiter pueda entrar en GitHub, abrir la demo y pensar:

"Esta persona sabe construir productos de software de verdad."

Y un potencial cliente pueda verla y pensar:

"Esto podría convertirse en un negocio real."

Al final en el gitignore crea deploy.md con una guía de puesta en marcha enun entorno real paso a paso y breve. desde configurar el dominio los pasos.