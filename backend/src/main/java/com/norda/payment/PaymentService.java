package com.norda.payment;

/**
 * Puerto de dominio (ADR-004): el checkout depende unicamente de esta interfaz.
 * DemoPaymentService es la implementacion activa en portfolio; StripePaymentService
 * se conecta el dia que existan credenciales reales, sin tocar OrderService.
 */
public interface PaymentService {

    PaymentChargeResult charge(PaymentChargeRequest request);

    PaymentProvider provider();
}
