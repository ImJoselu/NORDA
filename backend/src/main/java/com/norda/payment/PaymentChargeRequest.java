package com.norda.payment;

import java.util.UUID;

public record PaymentChargeRequest(
        UUID orderId,
        long amountCents,
        String currency,
        String customerEmail
) {
}
