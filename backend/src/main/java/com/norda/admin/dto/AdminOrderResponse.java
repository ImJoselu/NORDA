package com.norda.admin.dto;

import com.norda.order.OrderStatus;

import java.time.Instant;
import java.util.UUID;

public record AdminOrderResponse(
        UUID id,
        String orderNumber,
        OrderStatus status,
        String customerName,
        String customerEmail,
        long totalCents,
        int itemCount,
        Instant createdAt
) {
}
