package com.norda.shipping;

/**
 * Puerto de dominio (seccion 48): implementacion actual con tarifas fijas.
 * Preparado para integrar transportistas reales (Correos, GLS, DHL) sin tocar
 * el checkout.
 */
public interface ShippingProvider {

    long costCents(ShippingMethod method, long subtotalCents);
}
