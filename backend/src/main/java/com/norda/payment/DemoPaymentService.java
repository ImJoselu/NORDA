package com.norda.payment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Simula un PaymentIntent sin tocar ninguna pasarela real ni almacenar datos de
 * tarjeta (seccion 26). Siempre resuelve con exito de forma sincrona: es
 * intencionadamente predecible para que el checkout de portfolio funcione siempre.
 */
@Service
public class DemoPaymentService implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(DemoPaymentService.class);

    @Override
    public PaymentChargeResult charge(PaymentChargeRequest request) {
        String reference = "demo_pi_" + UUID.randomUUID();
        log.info("[DEMO PAYMENT] Cobro simulado de {} {} para el pedido {} -> {}",
                request.amountCents(), request.currency(), request.orderId(), reference);
        return PaymentChargeResult.success(reference);
    }

    @Override
    public PaymentProvider provider() {
        return PaymentProvider.DEMO;
    }
}
