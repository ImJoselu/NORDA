package com.norda.order.dto;

import com.norda.order.OrderStatus;

import java.time.Instant;
import java.util.UUID;

public record OrderSummaryResponse(
        UUID id,
        String orderNumber,
        OrderStatus status,
        long totalCents,
        int itemCount,
        Instant createdAt
) {
}
