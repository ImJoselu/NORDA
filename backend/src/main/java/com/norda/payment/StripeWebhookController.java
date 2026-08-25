package com.norda.payment;

import com.norda.order.Order;
import com.norda.order.OrderRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Preparado para Stripe real (seccion 26/ADR-004): mientras el checkout activo
 * sea DemoPaymentService (sincrono, sin pasarela), este endpoint no recibe
 * trafico real. El dia que se active StripePaymentService con un flujo async
 * (PaymentIntent + confirmacion en el cliente), este webhook es lo que marca
 * el pedido como pagado/fallido cuando Stripe notifica el resultado.
 */
@RestController
@RequestMapping("/api/webhooks")
public class StripeWebhookController {

    private static final Logger log = LoggerFactory.getLogger(StripeWebhookController.class);

    private final String webhookSecret;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public StripeWebhookController(
            @Value("${app.stripe.webhook-secret:}") String webhookSecret,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository
    ) {
        this.webhookSecret = webhookSecret;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @PostMapping("/stripe")
    @Transactional
    public ResponseEntity<Void> handle(@RequestBody String payload, HttpServletRequest request) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            log.info("Webhook de Stripe recibido pero STRIPE_WEBHOOK_SECRET no esta configurado (modo demo); se ignora.");
            return ResponseEntity.ok().build();
        }

        String signatureHeader = request.getHeader("Stripe-Signature");
        Event event;
        try {
            event = Webhook.constructEvent(payload, signatureHeader, webhookSecret);
        } catch (SignatureVerificationException ex) {
            log.warn("Firma de webhook de Stripe invalida.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        switch (event.getType()) {
            case "payment_intent.succeeded" -> handlePaymentIntentEvent(event, true);
            case "payment_intent.payment_failed" -> handlePaymentIntentEvent(event, false);
            case "checkout.session.completed" -> log.info("checkout.session.completed recibido: {}", event.getId());
            case "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted" ->
                    log.info("Evento de suscripcion {} recibido (gestionado por el modulo de suscripciones).", event.getType());
            default -> log.debug("Evento de Stripe no gestionado: {}", event.getType());
        }

        return ResponseEntity.ok().build();
    }

    private void handlePaymentIntentEvent(Event event, boolean succeeded) {
        StripeObject stripeObject = event.getDataObjectDeserializer().getObject().orElse(null);
        if (!(stripeObject instanceof PaymentIntent intent)) {
            return;
        }

        paymentRepository.findByExternalReference(intent.getId()).ifPresentOrElse(payment -> {
            if (succeeded) {
                payment.markSucceeded();
            } else {
                payment.markFailed();
            }

            orderRepository.findById(payment.getOrderId()).ifPresent(order -> updateOrderStatus(order, succeeded));
        }, () -> log.warn("Webhook de Stripe para un PaymentIntent desconocido: {}", intent.getId()));
    }

    private void updateOrderStatus(Order order, boolean succeeded) {
        if (succeeded) {
            order.markPaid();
        } else {
            order.markCancelled();
        }
    }
}
