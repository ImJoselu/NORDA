package com.norda.order.dto;

import com.norda.order.ShippingAddress;
import com.norda.shipping.ShippingMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CheckoutRequest(
        @Valid @NotNull ShippingAddress shippingAddress,
        @NotNull ShippingMethod shippingMethod
) {
}
