# Arquitectura de NØRDA

## Visión general

```
React (SPA, TS) → REST API (Spring Boot) → PostgreSQL
                        ↓
   Puertos de dominio: PaymentService · EmailService · ShippingProvider
                        ↓
Adaptadores: DemoPaymentService/StripePaymentService · MockEmailService/ResendEmailService
```

El dominio nunca conoce a los proveedores externos concretos. Cada integración (pagos, email,
logística) se define como una interfaz en el paquete de dominio correspondiente y se resuelve
mediante inyección de dependencias a la implementación activa según el perfil.

## Principios

- **Backend como única fuente de verdad**: precio, stock, descuento, rol y estado de pago se
  calculan y validan siempre en el servidor.
- **Sin dependencia obligatoria de Docker**: el backend se ejecuta como JAR (`java -jar`) y el
  frontend como sitio estático (`npm run build`). Docker es una vía de despliegue alternativa,
  no un requisito.
- **Configuración por entorno, nunca hardcodeada**: toda credencial o URL específica de entorno
  se resuelve vía variables de entorno (ver `.env.example` en la raíz y en `frontend/`).
- **Feature completa o no existe**: cada funcionalidad se entrega con diseño, UX, seguridad y
  test — nunca como integración simulada sin más, ni como botón sin efecto.

## Estructura del monorepo

```
norda/
├── backend/    Spring Boot 3 (Java 21), modular por dominio
├── frontend/   React 18 + TypeScript + Vite
├── docs/       Documentación de arquitectura y ADRs
└── docker-compose.yml   Opcional: Postgres local + backend en contenedor
```

El detalle de cada área se documenta en este directorio: [`database.md`](database.md) (esquema
y migraciones), [`api.md`](api.md) (referencia REST completa), [`security.md`](security.md)
(autenticación, autorización, límites conocidos) y [`deployment.md`](deployment.md) (guía de
despliegue independiente de proveedor).

## Decisiones registradas

Ver [`decisions.md`](decisions.md) para el índice completo y [`adr/`](./adr) para el
razonamiento detrás de cada decisión relevante (contexto, alternativas consideradas,
consecuencias).
