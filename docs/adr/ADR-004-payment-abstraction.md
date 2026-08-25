# ADR-004: Abstracción `PaymentService` para desacoplar Stripe del dominio

## Estado
Aceptado

## Contexto
NØRDA necesita un checkout funcional en modo demo (sin cobros reales, sección 25) que pueda
evolucionar a Stripe real sin reescribir `OrderService`. El checkout actual reserva inventario,
crea el pedido y cobra en una única transacción síncrona.

## Decisión
- `PaymentService` es la única interfaz que `OrderService` conoce: `charge(PaymentChargeRequest) -> PaymentChargeResult`.
- `DemoPaymentService` es la implementación activa: resuelve siempre con éxito de forma síncrona,
  sin tocar ninguna pasarela ni almacenar datos de tarjeta.
- `POST /api/webhooks/stripe` ya implementa verificación real de firma (`Stripe.Webhook.constructEvent`)
  y gestiona `payment_intent.succeeded`, `payment_intent.payment_failed` y `checkout.session.completed`,
  además de dejar preparados (solo logueados) los eventos de suscripción para la fase 10.

## Por qué no existe ya un `StripePaymentService` que cobre de verdad
Un cobro con Stripe real **no es síncrono**: requiere que el cliente tokenice la tarjeta con
Stripe.js/Elements, y el servidor confirme un `PaymentIntent` con ese método de pago; el resultado
definitivo llega después, vía webhook. Implementar un `StripePaymentService.charge()` que devolviera
éxito/fallo en la misma request —como hace hoy `DemoPaymentService`— sería código ficticio que no
reproduce cómo funciona Stripe realmente (prohibido explícitamente en la sección 60 del brief).

**Migración real futura (documentada, no implementada):** `OrderService.checkout()` crearía el
pedido en `PENDING`, `StripePaymentService` crearía un `PaymentIntent` y devolvería su
`client_secret` al frontend; el frontend confirmaría el pago con Stripe.js; y sería el webhook
—ya construido— quien marcara el pedido como `PAID` o `CANCELLED` cuando Stripe notifique el
resultado. Es un cambio de forma (síncrono → asíncrono), no de arquitectura: la interfaz
`PaymentService` y el webhook ya están preparados para ese flujo.

## Consecuencias
- El dominio (`OrderService`) es idéntico hoy y el día que se active Stripe real.
- El webhook puede probarse con la CLI de Stripe (`stripe listen --forward-to`) sin tocar el
  checkout actual, ya que hoy no le llega tráfico real (`DemoPaymentService` nunca lo dispara).
