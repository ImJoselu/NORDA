package com.norda.subscription.dto;

import com.norda.subscription.SubscriptionFrequency;
import com.norda.subscription.SubscriptionStatus;
import com.norda.subscription.SubscriptionType;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record SubscriptionResponse(
        UUID id,
        SubscriptionStatus status,
        int coffeeCount,
        SubscriptionFrequency frequency,
        SubscriptionType type,
        String originCountryName,
        LocalDate nextDeliveryDate,
        List<SubscriptionItemResponse> items
) {
    public record SubscriptionItemResponse(UUID productId, String productName, String productSlug) {
    }
}
