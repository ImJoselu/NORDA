package com.norda.order.dto;

import com.norda.order.OrderStatus;
import com.norda.order.ShippingAddress;
import com.norda.shipping.ShippingMethod;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        String orderNumber,
        OrderStatus status,
        ShippingAddress shippingAddress,
        ShippingMethod shippingMethod,
        long subtotalCents,
        long shippingCents,
        long discountCents,
        long taxCents,
        long totalCents,
        List<OrderItemResponse> items,
        Instant createdAt
) {
}
