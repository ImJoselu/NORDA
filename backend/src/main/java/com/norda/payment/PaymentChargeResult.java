package com.norda.payment;

public record PaymentChargeResult(
        boolean succeeded,
        String externalReference,
        String failureReason
) {
    public static PaymentChargeResult success(String externalReference) {
        return new PaymentChargeResult(true, externalReference, null);
    }

    public static PaymentChargeResult failure(String reason) {
        return new PaymentChargeResult(false, null, reason);
    }
}
