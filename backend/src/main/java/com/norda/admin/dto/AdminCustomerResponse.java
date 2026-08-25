package com.norda.admin.dto;

import java.time.Instant;
import java.util.UUID;

public record AdminCustomerResponse(
        UUID id,
        String name,
        String email,
        int orderCount,
        long totalSpentCents,
        Instant lastOrderAt,
        boolean hasActiveSubscription,
        Instant createdAt
) {
}
